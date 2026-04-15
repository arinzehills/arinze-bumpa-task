<?php

namespace App\ApiDocs;

use OpenApi\Annotations as OA;

/**
 * @OA\Post(
 *     path="/api/v1/payments",
 *     summary="Process payment",
 *     description="Process a payment for a product and award cashback points",
 *     tags={"Payments"},
 *     security={{"bearerAuth":{}}},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             type="object",
 *             required={"product_id"},
 *             @OA\Property(property="product_id", type="integer", example=1, description="ID of the product to purchase")
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Payment successful",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="Payment successful"),
 *             @OA\Property(
 *                 property="data",
 *                 type="object",
 *                 @OA\Property(property="cashback_points", type="integer", example=10),
 *                 @OA\Property(
 *                     property="payment",
 *                     type="object",
 *                     @OA\Property(property="id", type="integer", example=1),
 *                     @OA\Property(property="user_id", type="integer", example=1),
 *                     @OA\Property(property="product_id", type="integer", example=1),
 *                     @OA\Property(property="amount", type="string", example="99.99"),
 *                     @OA\Property(property="status", type="string", example="completed"),
 *                     @OA\Property(property="transaction_id", type="string", example="TXN_123456"),
 *                     @OA\Property(property="created_at", type="string", example="2026-04-15T10:00:00.000000Z")
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Payment failed"
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Unauthorized - authentication required"
 *     ),
 *     @OA\Response(
 *         response=422,
 *         description="Validation error"
 *     )
 * )
 *
 * @OA\Get(
 *     path="/api/v1/payments/history",
 *     summary="Get payment history",
 *     description="Retrieve the current user's payment history",
 *     tags={"Payments"},
 *     security={{"bearerAuth":{}}},
 *     @OA\Response(
 *         response=200,
 *         description="Payment history retrieved successfully",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="Payment history retrieved successfully"),
 *             @OA\Property(
 *                 property="data",
 *                 type="array",
 *                 @OA\Items(
 *                     type="object",
 *                     @OA\Property(property="id", type="integer", example=1),
 *                     @OA\Property(property="user_id", type="integer", example=1),
 *                     @OA\Property(property="product_id", type="integer", example=1),
 *                     @OA\Property(property="amount", type="string", example="99.99"),
 *                     @OA\Property(property="status", type="string", example="completed"),
 *                     @OA\Property(property="transaction_id", type="string", example="TXN_123456"),
 *                     @OA\Property(property="created_at", type="string", example="2026-04-15T10:00:00.000000Z")
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Unauthorized - authentication required"
 *     )
 * )
 *
 * @OA\Get(
 *     path="/api/v1/payments/total-spending",
 *     summary="Get total spending",
 *     description="Retrieve the current user's total spending amount",
 *     tags={"Payments"},
 *     security={{"bearerAuth":{}}},
 *     @OA\Response(
 *         response=200,
 *         description="Total spending retrieved successfully",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="Total spending retrieved successfully"),
 *             @OA\Property(
 *                 property="data",
 *                 type="object",
 *                 @OA\Property(property="total_spent", type="string", example="299.97")
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Unauthorized - authentication required"
 *     )
 * )
 */
class PaymentApi {}
