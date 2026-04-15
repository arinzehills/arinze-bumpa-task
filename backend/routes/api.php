<?php

use Illuminate\Support\Facades\Route;
use App\Modules\UserService\Http\Controllers\UserController;
use App\Modules\UserService\Http\Controllers\AuthController;
use App\Modules\LoyaltyService\Http\Controllers\LoyaltyController;
use App\Modules\ECommerceProductService\Http\Controllers\ProductController;
use App\Modules\PaymentService\Http\Controllers\PaymentController;

/*
|--------------------------------------------------------------------------
| API Routes - Version 1
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // Auth routes
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });

    // User routes
    Route::prefix('users')->group(function () {
        Route::get('/{user}', [UserController::class, 'show']);
        Route::get('/{user}/achievements', [UserController::class, 'getAchievements']);
    });

    // Admin routes (protected)
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/users', [UserController::class, 'getAllUsers']);
        Route::get('/users/achievements', [UserController::class, 'getAllUsersAchievements']);
    });

    // Product routes
    Route::prefix('products')->group(function () {
        Route::get('/', [ProductController::class, 'index']);
        Route::get('/{product}', [ProductController::class, 'show']);
    });

    // Payment routes (protected)
    Route::middleware('auth:api')->prefix('payments')->group(function () {
        Route::post('/', [PaymentController::class, 'processPayment']);
        Route::get('/history', [PaymentController::class, 'getUserPaymentHistory']);
        Route::get('/total-spending', [PaymentController::class, 'getUserTotalSpending']);
    });

    // Loyalty routes
    Route::get('/achievements', [LoyaltyController::class, 'getAllAchievements']);
    Route::get('/badges', [LoyaltyController::class, 'getAllBadges']);

});
