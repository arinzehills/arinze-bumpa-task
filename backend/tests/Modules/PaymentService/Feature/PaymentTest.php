<?php

namespace Tests\Modules\PaymentService\Feature;

use App\Modules\ECommerceProductService\Models\Product;
use App\Modules\PaymentService\Models\Payment;
use App\Modules\UserService\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

class PaymentTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test user can initialize payment
     */
    public function test_user_can_process_payment()
    {
        // Create user
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
            'total_points' => 0
        ]);

        // Create product
        $product = Product::create([
            'name' => 'Test Product',
            'description' => 'Test Description',
            'price' => 100.00,
            'sku' => 'TP-001',
            'stock' => 50,
            'image_url' => 'https://example.com/image.jpg'
        ]);

        // Get JWT token
        $token = JWTAuth::fromUser($user);

        // Initialize payment (step 1 of 2-step Paystack flow)
        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token}"
        ])->postJson('/api/v1/payments/initialize', [
            'product_id' => $product->id,
            'redirect_url' => 'http://localhost:5173/ecommerce/products/' . $product->id
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Payment initialized successfully'
            ])
            ->assertJsonStructure([
                'data' => ['payment_url', 'reference']
            ]);

        // Verify pending payment record created
        $this->assertDatabaseHas('payments', [
            'user_id' => $user->id,
            'product_id' => $product->id,
            'amount' => '100.00',
            'status' => 'pending'
        ]);

        // Get the reference from response
        $reference = $response->json('data.reference');

        // Verify payment endpoint (step 2 of 2-step flow)
        $verifyResponse = $this->getJson('/api/v1/payments/verify?reference=' . $reference);

        $verifyResponse->assertStatus(200)
            ->assertJson(['success' => true]);

        // Verify payment is now completed
        $this->assertDatabaseHas('payments', [
            'user_id' => $user->id,
            'product_id' => $product->id,
            'amount' => '100.00',
            'status' => 'completed'
        ]);

        // Verify user got points
        $user->refresh();
        $this->assertEquals(25, $user->total_points); // 25 points in development mode

        // Verify product stock decreased
        $product->refresh();
        $this->assertEquals(49, $product->stock);
    }

    /**
     * Test payment requires authentication
     */
    public function test_payment_requires_authentication()
    {
        $product = Product::create([
            'name' => 'Test Product',
            'description' => 'Test Description',
            'price' => 100.00,
            'sku' => 'TP-001',
            'stock' => 50,
            'image_url' => 'https://example.com/image.jpg'
        ]);

        $response = $this->postJson('/api/v1/payments', [
            'product_id' => $product->id
        ]);

        $response->assertStatus(401);
    }

    /**
     * Test payment fails for non-existent product
     */
    public function test_payment_fails_for_non_existent_product()
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
            'total_points' => 0
        ]);

        $token = JWTAuth::fromUser($user);

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token}"
        ])->postJson('/api/v1/payments', [
            'product_id' => 999
        ]);

        $response->assertStatus(422); // Validation error
    }

    /**
     * Test get payment history
     */
    public function test_user_can_get_payment_history()
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
            'total_points' => 0
        ]);

        $product = Product::create([
            'name' => 'Test Product',
            'description' => 'Test Description',
            'price' => 50.00,
            'sku' => 'TP-001',
            'stock' => 50,
            'image_url' => 'https://example.com/image.jpg'
        ]);

        // Create payment
        Payment::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'amount' => 50.00,
            'status' => 'completed',
            'transaction_id' => 'TXN_123'
        ]);

        $token = JWTAuth::fromUser($user);

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token}"
        ])->getJson('/api/v1/payments/history');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data.payments');
    }
}