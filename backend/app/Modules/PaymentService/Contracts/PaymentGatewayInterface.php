<?php

namespace App\Modules\PaymentService\Contracts;

interface PaymentGatewayInterface
{
    /**
     * Initialize payment transaction
     *
     * @param float $amount Amount in Naira
     * @param string $reference Unique transaction reference
     * @param string $email Customer email
     * @param string $redirectUrl Frontend URL to redirect after payment
     * @return array { authorization_url, access_code, reference }
     */
    public function initializePayment(float $amount, string $reference, string $email, string $redirectUrl): array;

    /**
     * Verify payment transaction
     *
     * @param string $reference Transaction reference
     * @return array { verified: bool, amount: float, transaction_id: string|null }
     */
    public function verifyPayment(string $reference): array;
}