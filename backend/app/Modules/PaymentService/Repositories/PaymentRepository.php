<?php

namespace App\Modules\PaymentService\Repositories;

use App\Repositories\BaseRepository;
use App\Modules\PaymentService\Models\Payment;

class PaymentRepository extends BaseRepository
{
    public function __construct(Payment $model)
    {
        parent::__construct($model);
    }

    /**
     * Get all payments
     */
    public function getAllPayments()
    {
        return $this->all();
    }

    /**
     * Get payments by user
     */
    public function getPaymentsByUser($userId)
    {
        return $this->query()
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get completed payments by user
     */
    public function getCompletedPaymentsByUser($userId)
    {
        return $this->query()
            ->where('user_id', $userId)
            ->where('status', 'completed')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Create a payment record
     */
    public function createPayment($userId, $productId, $amount)
    {
        return $this->create([
            'user_id' => $userId,
            'product_id' => $productId,
            'amount' => $amount,
            'status' => 'pending'
        ]);
    }

    /**
     * Mark payment as completed
     */
    public function completePayment($paymentId, $transactionId)
    {
        return $this->update([
            'status' => 'completed',
            'transaction_id' => $transactionId
        ], $paymentId);
    }

    /**
     * Mark payment as failed
     */
    public function failPayment($paymentId)
    {
        return $this->update([
            'status' => 'failed'
        ], $paymentId);
    }
}