<?php

namespace App\Modules\ECommerceProductService\Repositories;

use App\Repositories\BaseRepository;
use App\Modules\ECommerceProductService\Models\Product;

class ProductRepository extends BaseRepository
{
    public function __construct(Product $model)
    {
        parent::__construct($model);
    }

    /**
     * Get all products
     */
    public function getAllProducts()
    {
        return $this->all();
    }

    /**
     * Get product by SKU
     */
    public function getProductBySku($sku)
    {
        return $this->query()
            ->where('sku', $sku)
            ->first();
    }

    /**
     * Get products with stock
     */
    public function getInStockProducts()
    {
        return $this->query()
            ->where('stock', '>', 0)
            ->get();
    }

    /**
     * Get products paginated
     */
    public function getProductsPaginated($page = 1, $limit = 10)
    {
        $query = $this->query()->orderBy('created_at', 'desc');

        $total = $query->count();
        $totalPages = ceil($total / $limit);
        $offset = ($page - 1) * $limit;

        $products = $query->offset($offset)
            ->limit($limit)
            ->get();

        return [
            'products' => $products,
            'pagination' => [
                'page' => (int)$page,
                'limit' => (int)$limit,
                'total' => $total,
                'total_pages' => $totalPages,
            ]
        ];
    }
}