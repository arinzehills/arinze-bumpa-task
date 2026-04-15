<?php

namespace App\Modules\PaymentService\Services;

use App\Modules\PaymentService\Repositories\PaymentRepository;
use App\Modules\ECommerceProductService\Repositories\ProductRepository;
use App\Modules\UserService\Repositories\UserRepository;
use App\Modules\PaymentService\Events\PurchaseCompleted;

class PaymentService
{
    protected $paymentRepository;
    protected $productRepository;
    protected $userRepository;

    public function __construct(
        PaymentRepository $paymentRepository,
        ProductRepository $productRepository,
        UserRepository $userRepository
    ) {
        $this->paymentRepository = $paymentRepository;
        $this->productRepository = $productRepository;
        $this->userRepository = $userRepository;
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

            // Award cashback points (10% of purchase amount, rounded)
            $cashbackPoints = max(1, intval($product->price / 10));
            $this->userRepository->updatePoints($userId, $cashbackPoints);

            // Decrease product stock
            $this->productRepository->update([
                'stock' => $product->stock - 1
            ], $productId);

            // Fire purchase event for loyalty processing
            event(new PurchaseCompleted($userId, $productId, $product->price, $cashbackPoints));

            return [
                'success' => true,
                'payment' => $payment,
                'cashback_points' => $cashbackPoints,
                'message' => 'Payment successful'
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