<?php

return [
    /**
     * Default payment gateway
     * Options: 'paystack', 'flutterwave'
     */
    'gateway' => env('PAYMENT_GATEWAY', 'paystack'),

    /**
     * Paystack Configuration
     */
    'paystack' => [
        'secret_key' => env('PAYSTACK_SECRET_KEY'),
        'public_key' => env('PAYSTACK_PUBLIC_KEY'),
    ],

    /**
     * Flutterwave Configuration (future implementation)
     */
    'flutterwave' => [
        'secret_key' => env('FLUTTERWAVE_SECRET_KEY'),
        'public_key' => env('FLUTTERWAVE_PUBLIC_KEY'),
    ],
];