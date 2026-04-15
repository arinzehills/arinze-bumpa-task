<?php

namespace App\Modules\UserService\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Modules\UserService\Services\UserService;
use Illuminate\Http\Request;

class UserController extends BaseController
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Get user profile
     * GET /api/users/{user}
     */
    public function show($id)
    {
        try {
            $user = $this->userService->getUserProfile($id);
            return $this->successResponse($user, 'User retrieved successfully');
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Get user's achievements
     * GET /api/users/{user}/achievements
     */
    public function getAchievements($id)
    {
        try {
            $user = $this->userService->getUserAchievements($id);
            return $this->successResponse($user, 'User achievements retrieved successfully');
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Get all users with achievements (Admin)
     * GET /api/admin/users/achievements
     */
    public function getAllUsersAchievements()
    {
        try {
            $users = $this->userService->getAllUsersWithAchievements();
            return $this->successResponse($users, 'All users achievements retrieved successfully');
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }
}