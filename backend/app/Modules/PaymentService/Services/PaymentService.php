<?php

namespace App\Modules\PaymentService\Services;

use App\Modules\PaymentService\Repositories\PaymentRepository;
use App\Modules\ECommerceProductService\Repositories\ProductRepository;
use App\Modules\UserService\Repositories\UserRepository;
use App\Modules\LoyaltyService\Services\AchievementService;
use App\Modules\LoyaltyService\Services\BadgeService;
use App\Modules\PaymentService\Events\PurchaseCompleted;

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

            // Get user's badge BEFORE awarding points
            $user = $this->userRepository->find($userId);
            $oldBadge = $user->badge;

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
     * Get user's payment history
     */
    public function getUserPaymentHistory($userId)
    {
        return $this->paymentRepository->getPaymentsByUser($userId);
    }

    /**
     * Get user's total spending
     */
    public function getUserTotalSpending($userId)
    {
        $payments = $this->paymentRepository->getCompletedPaymentsByUser($userId);
        return $payments->sum('amount');
    }
}