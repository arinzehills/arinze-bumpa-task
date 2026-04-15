<?php

namespace Database\Seeders;

use App\Modules\ECommerceProductService\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Product::create([
            'name' => 'Wireless Headphones',
            'description' => 'High-quality wireless headphones with noise cancellation',
            'price' => 79.99,
            'sku' => 'WH-001',
            'stock' => 50,
            'image_url' => 'https://picsum.photos/400/300?random=1'
        ]);

        Product::create([
            'name' => 'USB-C Cable',
            'description' => 'Fast charging USB-C cable',
            'price' => 15.99,
            'sku' => 'UC-001',
            'stock' => 100,
            'image_url' => 'https://picsum.photos/400/300?random=2'
        ]);

        Product::create([
            'name' => 'Phone Stand',
            'description' => 'Adjustable phone stand for desk',
            'price' => 24.99,
            'sku' => 'PS-001',
            'stock' => 75,
            'image_url' => 'https://picsum.photos/400/300?random=3'
        ]);

        Product::create([
            'name' => 'Screen Protector',
            'description' => 'Tempered glass screen protector',
            'price' => 12.99,
            'sku' => 'SP-001',
            'stock' => 200,
            'image_url' => 'https://picsum.photos/400/300?random=4'
        ]);

        Product::create([
            'name' => 'Phone Case',
            'description' => 'Protective phone case with grip',
            'price' => 19.99,
            'sku' => 'PC-001',
            'stock' => 150,
            'image_url' => 'https://picsum.photos/400/300?random=5'
        ]);

        Product::create([
            'name' => 'Portable Charger',
            'description' => '20000mAh portable power bank',
            'price' => 49.99,
            'sku' => 'PB-001',
            'stock' => 60,
            'image_url' => 'https://picsum.photos/400/300?random=6'
        ]);
    }
}