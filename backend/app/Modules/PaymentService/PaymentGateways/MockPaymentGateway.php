<?php

namespace App\Modules\PaymentService\PaymentGateways;

use App\Modules\PaymentService\Contracts\PaymentGatewayInterface;

class MockPaymentGateway implements PaymentGatewayInterface
{
    /**
     * Initialize mock payment - always succeeds
     */
    public function initializePayment(float $amount, string $reference, string $email, string $redirectUrl): array
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
    public function verifyPayment(string $reference): array
    {
        return [
            'verified' => true,
            'transaction_id' => 'MOCK_' . $reference,
            'status' => 'success',
        ];
    }
}