<?php

namespace App\Modules\PaymentService\Factories;

use App\Modules\PaymentService\Contracts\PaymentGatewayInterface;
use App\Modules\PaymentService\PaymentGateways\PaystackGateway;
use App\Modules\PaymentService\PaymentGateways\FlutterwaveGateway;
use InvalidArgumentException;

class PaymentGatewayFactory
{
    /**
     * Create payment gateway instance based on configuration
     *
     * @param string|null $gateway Gateway name (defaults to PAYMENT_GATEWAY env)
     * @return PaymentGatewayInterface
     * @throws InvalidArgumentException
     */
    public static function make(?string $gateway = null): PaymentGatewayInterface
    {
        $gateway = $gateway ?? config('payment.gateway');

        return match ($gateway) {
            'paystack' => new PaystackGateway(),
            'flutterwave' => new FlutterwaveGateway(),
            default => throw new InvalidArgumentException("Unsupported payment gateway: {$gateway}"),
        };
    }
}