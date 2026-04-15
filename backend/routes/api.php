<?php

use Illuminate\Support\Facades\Route;
use App\Modules\UserService\Http\Controllers\UserController;
use App\Modules\UserService\Http\Controllers\AuthController;

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

    // Admin routes
    Route::prefix('admin')->group(function () {
        Route::get('/users/achievements', [UserController::class, 'getAllUsersAchievements']);
    });

});
