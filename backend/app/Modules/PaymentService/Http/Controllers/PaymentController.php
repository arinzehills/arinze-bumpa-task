<?php

namespace App\Modules\PaymentService\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Modules\PaymentService\Services\PaymentService;
use App\Modules\PaymentService\Http\Requests\ProcessPaymentRequest;

class PaymentController extends BaseController
{
    protected $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    /**
     * Process payment
     */
    public function processPayment(ProcessPaymentRequest $request)
    {
        try {
            $result = $this->paymentService->processPayment(
                auth()->id(),
                $request->product_id
            );

            if ($result['success']) {
                return $this->successResponse($result, $result['message'], 201);
            } else {
                return $this->errorResponse($result['message'], 400);
            }
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Get user's payment history
     */
    public function getUserPaymentHistory()
    {
        try {
            $payments = $this->paymentService->getUserPaymentHistory(auth()->id());
            return $this->successResponse($payments, 'Payment history retrieved successfully');
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Get user's total spending
     */
    public function getUserTotalSpending()
    {
        try {
            $total = $this->paymentService->getUserTotalSpending(auth()->id());
            return $this->successResponse(['total_spent' => $total], 'Total spending retrieved successfully');
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }
}