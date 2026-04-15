<?php

namespace App\ApiDocs;

use OpenApi\Annotations as OA;

/**
 * @OA\Info(
 *     title="Loyalty Program API",
 *     version="1.0.0",
 *     description="E-commerce Loyalty Program API with event-driven architecture for achievements, badges, and rewards"
 * )
 *
 * @OA\Server(
 *     url=L5_SWAGGER_CONST_HOST,
 *     description="API Server"
 * )
 *
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT",
 *     description="Use the Bearer token from login endpoint"
 * )
 */
class BaseApi {}