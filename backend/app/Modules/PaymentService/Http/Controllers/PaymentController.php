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

    /**
     * Initialize payment with Paystack
     */
    public function initializePayment(ProcessPaymentRequest $request)
    {
        try {
            $redirectUrl = $request->input('redirect_url');
            $result = $this->paymentService->initializePayment(
                auth()->id(),
                $request->product_id,
                $redirectUrl
            );
            return $this->successResponse($result, 'Payment initialized successfully', 201);
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Verify payment after Paystack redirect
     */
    public function verifyPayment()
    {
        try {
            $reference = request()->query('reference');
            if (!$reference) {
                return $this->errorResponse('Payment reference required', 400);
            }

            $result = $this->paymentService->verifyPayment($reference);
            $statusCode = $result['success'] ? 200 : 400;
            return $this->successResponse($result, $result['message'], $statusCode);
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Get payment verification status (for frontend after Paystack redirect)
     */
    public function getPaymentStatus()
    {
        try {
            $reference = request()->query('reference');
            if (!$reference) {
                return $this->errorResponse('Payment reference required', 400);
            }

            $payment = $this->paymentService->getPaymentByReference($reference);
            if (!$payment) {
                return $this->errorResponse('Payment not found', 404);
            }

            return $this->successResponse([
                'status' => $payment->status,
                'unlocked_achievements' => $payment->unlocked_data['achievements'] ?? [],
                'unlocked_badges' => $payment->unlocked_data['badges'] ?? [],
            ], 'Payment status retrieved');
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }
}