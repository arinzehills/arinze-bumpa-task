<?php

namespace App\Modules\PaymentService\PaymentGateways;

use App\Modules\PaymentService\Contracts\PaymentGatewayInterface;

class MockPaymentGateway implements PaymentGatewayInterface
{
    /**
     * Initialize mock payment - always succeeds
     */
    public function initializePayment($amount, $reference, $email, $callbackUrl)
    {
        return [
            'authorization_url' => 'https://checkout.paystack.com/mock/' . $reference,
            'access_code' => 'mock_' . $reference,
            'reference' => $reference,
        ];
    }

    /**
     * Verify mock payment - always succeeds
     */
    public function verifyPayment($reference)
    {
        return [
            'verified' => true,
            'transaction_id' => 'MOCK_' . $reference,
            'status' => 'success',
        ];
    }
}