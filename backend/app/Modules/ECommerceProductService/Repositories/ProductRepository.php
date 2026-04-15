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
}