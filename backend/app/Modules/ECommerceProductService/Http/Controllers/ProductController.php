<?php

namespace App\Modules\ECommerceProductService\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Modules\ECommerceProductService\Models\Product;
use App\Modules\ECommerceProductService\Repositories\ProductRepository;
use Illuminate\Http\Request;

class ProductController extends BaseController
{
    protected $productRepository;

    public function __construct(ProductRepository $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    /**
     * Get all products
     * GET /api/v1/products?page=1&limit=10
     */
    public function index(Request $request)
    {
        try {
            $page = $request->query('page', 1);
            $limit = $request->query('limit', 10);

            $result = $this->productRepository->getProductsPaginated($page, $limit);
            return $this->paginatedResponse(
                $result['products'],
                $result['pagination'],
                'Products retrieved successfully'
            );
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