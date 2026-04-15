<?php

namespace Tests\Modules\ECommerceProductService\Feature;

use App\Modules\ECommerceProductService\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test can get all products
     */
    public function test_can_get_all_products()
    {
        // Create sample products
        Product::create([
            'name' => 'Test Product 1',
            'description' => 'Test Description 1',
            'price' => 29.99,
            'sku' => 'TP-001',
            'stock' => 50,
            'image_url' => 'https://via.placeholder.com/400x300?text=Test+Product+1'
        ]);

        Product::create([
            'name' => 'Test Product 2',
            'description' => 'Test Description 2',
            'price' => 49.99,
            'sku' => 'TP-002',
            'stock' => 30,
            'image_url' => 'https://via.placeholder.com/400x300?text=Test+Product+2'
        ]);

        $response = $this->getJson('/api/v1/products');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Products retrieved successfully'
            ])
            ->assertJsonCount(2, 'data');
    }

    /**
     * Test can get single product
     */
    public function test_can_get_single_product()
    {
        $product = Product::create([
            'name' => 'Test Product',
            'description' => 'Test Description',
            'price' => 39.99,
            'sku' => 'TP-001',
            'stock' => 50,
            'image_url' => 'https://via.placeholder.com/400x300?text=Test+Product'
        ]);

        $response = $this->getJson("/api/v1/products/{$product->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Product retrieved successfully'
            ])
            ->assertJsonPath('data.name', 'Test Product')
            ->assertJsonPath('data.price', '39.99');
    }

    /**
     * Test get non-existent product returns 404
     */
    public function test_get_non_existent_product_returns_404()
    {
        $response = $this->getJson('/api/v1/products/999');

        $response->assertStatus(404);
    }
}