<?php

namespace App\Modules\ECommerceProductService\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Modules\ECommerceProductService\Models\Product;
use App\Modules\ECommerceProductService\Repositories\ProductRepository;

class ProductController extends BaseController
{
    protected $productRepository;

    public function __construct(ProductRepository $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    /**
     * Get all products
     */
    public function index()
    {
        try {
            $products = $this->productRepository->getAllProducts();
            return $this->successResponse($products, 'Products retrieved successfully');
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Get single product
     */
    public function show(Product $product)
    {
        try {
            return $this->successResponse($product, 'Product retrieved successfully');
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }
}