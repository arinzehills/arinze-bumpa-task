<?php

namespace App\Modules\PaymentService\PaymentGateways;

use App\Modules\PaymentService\Contracts\PaymentGatewayInterface;
use Exception;

class FlutterwaveGateway implements PaymentGatewayInterface
{
    /**
     * Initialize payment with Flutterwave
     *
     * Note: Not yet implemented. This gateway is stubbed to demonstrate
     * the extensibility of the factory pattern.
     *
     * @param float $amount
     * @param string $reference
     * @param string $email
     * @param string $redirectUrl
     * @return array
     * @throws Exception
     */
    public function initializePayment(float $amount, string $reference, string $email, string $redirectUrl): array
    {
        throw new Exception('Flutterwave gateway not yet implemented');
    }

    /**
     * Verify payment with Flutterwave
     *
     * @param string $reference
     * @return array
     * @throws Exception
     */
    public function verifyPayment(string $reference): array
    {
        throw new Exception('Flutterwave gateway not yet implemented');
    }
}