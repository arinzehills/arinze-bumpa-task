<?php

namespace App\Modules\PaymentService\Services;

use App\Modules\PaymentService\Repositories\PaymentRepository;
use App\Modules\ECommerceProductService\Repositories\ProductRepository;
use App\Modules\UserService\Repositories\UserRepository;
use App\Modules\LoyaltyService\Services\AchievementService;
use App\Modules\LoyaltyService\Services\BadgeService;
use App\Modules\PaymentService\Events\PurchaseCompleted;
use App\Modules\PaymentService\Factories\PaymentGatewayFactory;
use Illuminate\Support\Str;

class PaymentService
{
    protected $paymentRepository;
    protected $productRepository;
    protected $userRepository;
    protected $achievementService;
    protected $badgeService;

    public function __construct(
        PaymentRepository $paymentRepository,
        ProductRepository $productRepository,
        UserRepository $userRepository,
        AchievementService $achievementService,
        BadgeService $badgeService
    ) {
        $this->paymentRepository = $paymentRepository;
        $this->productRepository = $productRepository;
        $this->userRepository = $userRepository;
        $this->achievementService = $achievementService;
        $this->badgeService = $badgeService;
    }

    /**
     * Process payment for a product
     */
    public function processPayment($userId, $productId)
    {
        // Get product
        $product = $this->productRepository->find($productId);
        if (!$product) {
            throw new \Exception('Product not found');
        }

        // Check stock
        if ($product->stock <= 0) {
            throw new \Exception('Product out of stock');
        }

        // Create payment record
        $payment = $this->paymentRepository->createPayment(
            $userId,
            $productId,
            $product->price
        );

        // Simulate payment processing (mock Paystack/Flutterwave)
        $paymentSuccessful = $this->mockPaymentGateway($product->price);

        if ($paymentSuccessful) {
            // Mark payment as completed
            $this->paymentRepository->completePayment($payment->id, 'TXN_' . uniqid());

            // Get user's badge BEFORE awarding points
            $user = $this->userRepository->find($userId);
            $oldBadge = $user->badge;

            // Award cashback points
            // Development: Fixed 25 points per purchase (for easy testing)
            // Production: 10% of purchase amount (real cashback calculation)
            if (env('APP_ENV') === 'local') {
                // Development: Fixed points for easy testing
                $cashbackPoints = 25;
            } else {
                // Production: Calculate as 10% of purchase amount
                $cashbackPoints = max(1, intval($product->price / 10));
            }
            $this->userRepository->updatePoints($userId, $cashbackPoints);

            // Decrease product stock
            $this->productRepository->update([
                'stock' => $product->stock - 1
            ], $productId);

            // Check and unlock achievements/badges before firing event
            $purchaseData = [
                'amount' => $product->price,
                'product_id' => $productId,
                'points' => $cashbackPoints
            ];
            $unlockedAchievements = $this->achievementService->checkAndUnlockAchievements($userId, $purchaseData);
            $this->badgeService->checkAndAssignBadge($userId);

            // Get user's badge AFTER awarding points
            $userAfter = $this->userRepository->find($userId);
            $newBadge = $userAfter->badge;

            // Check if badge changed
            $unlockedBadges = [];
            $oldBadgeId = $oldBadge ? $oldBadge->id : null;
            $newBadgeId = $newBadge ? $newBadge->id : null;
            if ($oldBadgeId !== $newBadgeId && $newBadge) {
                $unlockedBadges[] = [
                    'name' => $newBadge->name,
                    'description' => $newBadge->description
                ];
            }

            // Fire purchase event for loyalty processing
            event(new PurchaseCompleted($userId, $productId, $product->price, $cashbackPoints));

            // Format unlocked achievements for response
            $achievementsForResponse = [];
            if ($unlockedAchievements) {
                if (is_array($unlockedAchievements)) {
                    $achievementsForResponse = array_map(fn($a) => [
                        'name' => $a->name,
                        'description' => $a->description
                    ], $unlockedAchievements);
                } else {
                    $achievementsForResponse = $unlockedAchievements->map(fn($a) => [
                        'name' => $a->name,
                        'description' => $a->description
                    ])->toArray();
                }
            }

            return [
                'success' => true,
                'payment' => $payment,
                'cashback_points' => $cashbackPoints,
                'message' => 'Payment successful',
                'unlocked_achievements' => $achievementsForResponse,
                'unlocked_badges' => $unlockedBadges
            ];
        } else {
            // Mark payment as failed
            $this->paymentRepository->failPayment($payment->id);

            return [
                'success' => false,
                'message' => 'Payment failed'
            ];
        }
    }

    /**
     * Mock payment gateway (simulates Paystack/Flutterwave)
     * In real implementation, integrate with actual payment provider
     */
    private function mockPaymentGateway($amount)
    {
        // Simulate 95% success rate
        return rand(1, 100) <= 95;
    }

    /**
     * Get payment by reference
     */
    public function getPaymentByReference($reference)
    {
        return $this->paymentRepository->query()->where('reference', $reference)->first();
    }

    /**
     * Get user's payment history
     */
    public function getUserPaymentHistory($userId)
    {
        $payments = $this->paymentRepository->getPaymentsByUser($userId);

        return [
            'payments' => $payments,
            'pagination' => [
                'total' => count($payments),
            ]
        ];
    }

    /**
     * Get user's total spending
     */
    public function getUserTotalSpending($userId)
    {
        $payments = $this->paymentRepository->getCompletedPaymentsByUser($userId);
        return $payments->sum('amount');
    }

    /**
     * Initialize payment with Paystack
     */
    public function initializePayment($userId, $productId, $redirectUrl)
    {
        $product = $this->productRepository->find($productId);
        if (!$product) {
            throw new \Exception('Product not found');
        }
        if ($product->stock <= 0) {
            throw new \Exception('Product out of stock');
        }

        $reference = 'REF_' . Str::uuid();
        $this->createPendingPayment($userId, $productId, $product->price, $reference, $redirectUrl);

        $user = $this->userRepository->find($userId);
        $gateway = PaymentGatewayFactory::make();
        $gatewayResponse = $gateway->initializePayment($product->price, $reference, $user->email, $redirectUrl);

        return [
            'success' => true,
            'payment_url' => $gatewayResponse['authorization_url'],
            'reference' => $reference
        ];
    }

    /**
     * Verify payment and complete transaction (idempotent - safe to call multiple times)
     */
    public function verifyPayment($reference)
    {
        $payment = $this->paymentRepository->query()->where('reference', $reference)->first();
        if (!$payment) {
            throw new \Exception('Payment not found');
        }

        // If already verified, return stored unlocked data (idempotent)
        if ($payment->status === 'completed') {
            return [
                'success' => true,
                'message' => 'Payment already verified',
                'unlocked_achievements' => $payment->unlocked_data['achievements'] ?? [],
                'unlocked_badges' => $payment->unlocked_data['badges'] ?? [],
            ];
        }

        $gateway = PaymentGatewayFactory::make();
        $result = $gateway->verifyPayment($reference);

        if (!$result['verified']) {
            $this->paymentRepository->update(['status' => 'failed'], $payment->id);
            return $this->failedPaymentResponse($payment);
        }

        $this->paymentRepository->update(['status' => 'completed', 'transaction_id' => $result['transaction_id']], $payment->id);

        $cashbackPoints = $this->calculateCashbackPoints($payment->amount);
        $this->userRepository->updatePoints($payment->user_id, $cashbackPoints);
        $this->decreaseProductStock($payment->product_id);

        $purchaseData = ['amount' => $payment->amount, 'product_id' => $payment->product_id, 'points' => $cashbackPoints];
        $unlockedAchievements = $this->achievementService->checkAndUnlockAchievements($payment->user_id, $purchaseData);
        $badgeChange = $this->checkBadgeChange($payment->user_id);

        event(new PurchaseCompleted($payment->user_id, $payment->product_id, $payment->amount, $cashbackPoints));

        return $this->successfulPaymentResponse($payment, $cashbackPoints, $unlockedAchievements, $badgeChange);
    }

    private function createPendingPayment($userId, $productId, $amount, $reference, $redirectUrl)
    {
        return $this->paymentRepository->create([
            'user_id' => $userId,
            'product_id' => $productId,
            'amount' => $amount,
            'status' => 'pending',
            'reference' => $reference,
            'redirect_url' => $redirectUrl,
            'payment_method' => 'paystack'
        ]);
    }

    private function calculateCashbackPoints($amount)
    {
        return env('APP_ENV') === 'local' ? 25 : max(1, intval($amount / 10));
    }

    private function decreaseProductStock($productId)
    {
        $product = $this->productRepository->find($productId);
        $this->productRepository->update(['stock' => $product->stock - 1], $productId);
    }

    private function checkBadgeChange($userId)
    {
        $oldBadge = $this->userRepository->find($userId)->badge;
        $this->badgeService->checkAndAssignBadge($userId);
        $newBadge = $this->userRepository->find($userId)->badge;

        $oldBadgeId = $oldBadge ? $oldBadge->id : null;
        $newBadgeId = $newBadge ? $newBadge->id : null;

        if ($oldBadgeId !== $newBadgeId && $newBadge) {
            return ['name' => $newBadge->name, 'description' => $newBadge->description];
        }
        return null;
    }

    private function formatAchievements($unlockedAchievements)
    {
        if (!$unlockedAchievements) {
            return [];
        }
        if (is_array($unlockedAchievements)) {
            return array_map(fn($a) => ['name' => $a->name, 'description' => $a->description], $unlockedAchievements);
        }
        return $unlockedAchievements->map(fn($a) => ['name' => $a->name, 'description' => $a->description])->toArray();
    }

    private function failedPaymentResponse($payment)
    {
        return [
            'success' => false,
            'message' => 'Payment verification failed',
            'redirect_url' => $payment->redirect_url . '?payment_success=false'
        ];
    }

    private function successfulPaymentResponse($payment, $cashbackPoints, $unlockedAchievements, $badgeChange)
    {
        $unlockedBadges = $badgeChange ? [$badgeChange] : [];
        $unlockedData = [
            'achievements' => $this->formatAchievements($unlockedAchievements),
            'badges' => $unlockedBadges
        ];

        // Save unlocked items to database (the book, not sticky notes!)
        $this->paymentRepository->update(['unlocked_data' => $unlockedData], $payment->id);

        return [
            'success' => true,
            'payment' => $payment,
            'cashback_points' => $cashbackPoints,
            'message' => 'Payment verified successfully',
            'unlocked_achievements' => $unlockedData['achievements'],
            'unlocked_badges' => $unlockedData['badges'],
            'redirect_url' => $payment->redirect_url . '?payment_success=true&reference=' . $payment->reference
        ];
    }
}