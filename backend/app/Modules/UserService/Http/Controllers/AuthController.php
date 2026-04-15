<?php

namespace App\Modules\UserService\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Modules\UserService\Services\UserService;
use App\Modules\UserService\Http\Requests\RegisterRequest;
use App\Modules\UserService\Http\Requests\LoginRequest;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends BaseController
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
        $this->middleware('auth:api', ['except' => ['login', 'register']]);
    }

    /**
     * Register a new user
     * POST /api/v1/auth/register
     */
    public function register(RegisterRequest $request)
    {
        try {
            $user = $this->userService->createUser($request->validated());
            $token = JWTAuth::fromUser($user);

            return $this->successResponse([
                'user' => $user,
                'token' => $token,
            ], 'User registered successfully', 201);

        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Login user
     * POST /api/v1/auth/login
     */
    public function login(LoginRequest $request)
    {
        try {
            $credentials = $request->only('email', 'password');

            if (!$token = Auth::guard('api')->attempt($credentials)) {
                return $this->errorResponse('Invalid credentials', 401);
            }

            $user = Auth::guard('api')->user();

            return $this->successResponse([
                'user' => $user,
                'token' => $token,
            ], 'Login successful');

        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Get authenticated user
     * GET /api/v1/auth/me
     */
    public function me()
    {
        try {
            $user = Auth::guard('api')->user();
            return $this->successResponse($user, 'User retrieved successfully');
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Logout user
     * POST /api/v1/auth/logout
     */
    public function logout()
    {
        try {
            Auth::guard('api')->logout();
            return $this->successResponse(null, 'Logged out successfully');
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }
}