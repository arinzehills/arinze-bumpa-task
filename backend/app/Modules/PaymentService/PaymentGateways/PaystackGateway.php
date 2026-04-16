<?php

namespace App\Modules\PaymentService\PaymentGateways;

use App\Modules\PaymentService\Contracts\PaymentGatewayInterface;
use Illuminate\Support\Facades\Http;
use Exception;

class PaystackGateway implements PaymentGatewayInterface
{
    private string $baseUrl = 'https://api.paystack.co';
    private string $secretKey;

    public function __construct()
    {
        $this->secretKey = config('payment.paystack.secret_key');

        if (!$this->secretKey) {
            throw new Exception('Paystack secret key not configured');
        }
    }

    /**
     * Initialize payment with Paystack
     *
     * @param float $amount Amount in Naira
     * @param string $reference Unique transaction reference
     * @param string $email Customer email
     * @param string $redirectUrl Frontend URL to redirect after payment
     * @return array
     * @throws Exception
     */
    public function initializePayment(float $amount, string $reference, string $email, string $redirectUrl): array
    {
        $response = Http::withHeaders([
            'Authorization' => "Bearer {$this->secretKey}",
            'Content-Type' => 'application/json',
        ])->post("{$this->baseUrl}/transaction/initialize", [
            'email' => $email,
            'amount' => (int) ($amount * 100), // Paystack expects amount in kobo
            'reference' => $reference,
            'redirect' => $redirectUrl, // Paystack redirects here after payment
        ]);

        if (!$response->successful()) {
            throw new Exception('Failed to initialize Paystack payment: ' . $response->body());
        }

        $data = $response->json();

        return [
            'authorization_url' => $data['data']['authorization_url'],
            'access_code' => $data['data']['access_code'],
            'reference' => $data['data']['reference'],
        ];
    }

    /**
     * Verify payment with Paystack
     *
     * @param string $reference Transaction reference
     * @return array
     * @throws Exception
     */
    public function verifyPayment(string $reference): array
    {
        $response = Http::withHeaders([
            'Authorization' => "Bearer {$this->secretKey}",
        ])->get("{$this->baseUrl}/transaction/verify/{$reference}");

        if (!$response->successful()) {
            throw new Exception('Failed to verify Paystack payment: ' . $response->body());
        }

        $data = $response->json();
        $transaction = $data['data'];

        return [
            'verified' => $transaction['status'] === 'success',
            'amount' => $transaction['amount'] / 100, // Convert from kobo to Naira
            'transaction_id' => $transaction['reference'],
        ];
    }
}