<?php

namespace App\ApiDocs;

use OpenApi\Annotations as OA;

/**
 * @OA\Get(
 *     path="/api/v1/products",
 *     summary="Get all products",
 *     description="Retrieve a list of all available products",
 *     tags={"Products"},
 *     @OA\Response(
 *         response=200,
 *         description="Products retrieved successfully",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="Products retrieved successfully"),
 *             @OA\Property(
 *                 property="data",
 *                 type="array",
 *                 @OA\Items(
 *                     type="object",
 *                     @OA\Property(property="id", type="integer", example=1),
 *                     @OA\Property(property="name", type="string", example="Wireless Headphones"),
 *                     @OA\Property(property="description", type="string", example="High-quality wireless headphones with noise cancellation"),
 *                     @OA\Property(property="price", type="string", example="79.99"),
 *                     @OA\Property(property="sku", type="string", example="WH-001"),
 *                     @OA\Property(property="stock", type="integer", example=50),
 *                     @OA\Property(property="image_url", type="string", example="https://via.placeholder.com/400x300?text=Wireless+Headphones"),
 *                     @OA\Property(property="created_at", type="string", example="2026-04-15T10:00:00.000000Z"),
 *                     @OA\Property(property="updated_at", type="string", example="2026-04-15T10:00:00.000000Z")
 *                 )
 *             )
 *         )
 *     )
 * )
 *
 * @OA\Get(
 *     path="/api/v1/products/{id}",
 *     summary="Get single product",
 *     description="Retrieve details of a specific product",
 *     tags={"Products"},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="Product ID",
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Product retrieved successfully",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="Product retrieved successfully"),
 *             @OA\Property(
 *                 property="data",
 *                 type="object",
 *                 @OA\Property(property="id", type="integer", example=1),
 *                 @OA\Property(property="name", type="string", example="Wireless Headphones"),
 *                 @OA\Property(property="description", type="string", example="High-quality wireless headphones with noise cancellation"),
 *                 @OA\Property(property="price", type="string", example="79.99"),
 *                 @OA\Property(property="sku", type="string", example="WH-001"),
 *                 @OA\Property(property="stock", type="integer", example=50),
 *                 @OA\Property(property="image_url", type="string", example="https://via.placeholder.com/400x300?text=Wireless+Headphones"),
 *                 @OA\Property(property="created_at", type="string", example="2026-04-15T10:00:00.000000Z"),
 *                 @OA\Property(property="updated_at", type="string", example="2026-04-15T10:00:00.000000Z")
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Product not found"
 *     )
 * )
 */
class ProductApi {}