<?php

namespace App\ApiDocs;

use OpenApi\Annotations as OA;

/**
 * @OA\Tag(
 *     name="Users",
 *     description="User management endpoints"
 * )
 *
 * @OA\Get(
 *     path="/users/{user}",
 *     summary="Get user profile",
 *     description="Retrieve user profile information",
 *     tags={"Users"},
 *     security={{"bearerAuth":{}}},
 *     @OA\Parameter(
 *         name="user",
 *         in="path",
 *         required=true,
 *         description="User ID",
 *         @OA\Schema(type="integer", example=1)
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="User retrieved successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="User retrieved successfully"),
 *             @OA\Property(property="data", type="object",
 *                 @OA\Property(property="id", type="integer", example=1),
 *                 @OA\Property(property="name", type="string", example="John Doe"),
 *                 @OA\Property(property="email", type="string", example="john@example.com"),
 *                 @OA\Property(property="total_points", type="integer", example=250),
 *                 @OA\Property(property="current_badge_name", type="string", example="Silver")
 *             )
 *         )
 *     ),
 *     @OA\Response(response=404, description="User not found")
 * )
 *
 * @OA\Get(
 *     path="/users/{user}/achievements",
 *     summary="Get user achievements",
 *     description="Retrieve user's unlocked achievements and current badge",
 *     tags={"Users"},
 *     security={{"bearerAuth":{}}},
 *     @OA\Parameter(
 *         name="user",
 *         in="path",
 *         required=true,
 *         description="User ID",
 *         @OA\Schema(type="integer", example=1)
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="User achievements retrieved successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="User achievements retrieved successfully"),
 *             @OA\Property(property="data", type="object",
 *                 @OA\Property(property="id", type="integer", example=1),
 *                 @OA\Property(property="name", type="string", example="John Doe"),
 *                 @OA\Property(property="email", type="string", example="john@example.com"),
 *                 @OA\Property(property="total_points", type="integer", example=250),
 *                 @OA\Property(property="current_badge_name", type="string", example="Silver"),
 *                 @OA\Property(property="achievements", type="array",
 *                     @OA\Items(
 *                         @OA\Property(property="id", type="integer", example=1),
 *                         @OA\Property(property="name", type="string", example="First Purchase"),
 *                         @OA\Property(property="description", type="string", example="Made your first purchase"),
 *                         @OA\Property(property="points", type="integer", example=50),
 *                         @OA\Property(property="unlocked_at", type="string", example="2026-04-15T10:30:00Z")
 *                     )
 *                 ),
 *                 @OA\Property(property="badge", type="object",
 *                     @OA\Property(property="id", type="integer", example=2),
 *                     @OA\Property(property="name", type="string", example="Silver"),
 *                     @OA\Property(property="description", type="string", example="Earned 200+ points")
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(response=404, description="User not found")
 * )
 *
 * @OA\Get(
 *     path="/admin/users/achievements",
 *     summary="Get all users achievements (Admin)",
 *     description="Retrieve all users with their achievements and badges (Admin only)",
 *     tags={"Users", "Admin"},
 *     security={{"bearerAuth":{}}},
 *     @OA\Response(
 *         response=200,
 *         description="All users achievements retrieved successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="All users achievements retrieved successfully"),
 *             @OA\Property(property="data", type="array",
 *                 @OA\Items(
 *                     @OA\Property(property="id", type="integer", example=1),
 *                     @OA\Property(property="name", type="string", example="John Doe"),
 *                     @OA\Property(property="email", type="string", example="john@example.com"),
 *                     @OA\Property(property="total_points", type="integer", example=250),
 *                     @OA\Property(property="current_badge_name", type="string", example="Silver"),
 *                     @OA\Property(property="achievements_count", type="integer", example=5)
 *                 )
 *             )
 *         )
 *     )
 * )
 */
class UserDocs {}