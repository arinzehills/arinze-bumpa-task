<?php

namespace App\Modules\UserService\Services;

use App\Modules\UserService\Repositories\UserRepository;
use Illuminate\Support\Facades\Hash;

class UserService
{
    protected $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * Get user profile
     */
    public function getUserProfile($userId)
    {
        return $this->userRepository->find($userId);
    }

    /**
     * Get user with achievements
     */
    public function getUserAchievements($userId)
    {
        return $this->userRepository->getUserWithAchievements($userId);
    }

    /**
     * Create new user
     */
    public function createUser(array $data)
    {
        $data['password'] = Hash::make($data['password']);
        $data['total_points'] = 0;
        return $this->userRepository->create($data);
    }

    /**
     * Add points to user
     */
    public function addPoints($userId, $points)
    {
        return $this->userRepository->updatePoints($userId, $points);
    }

    /**
     * Assign badge to user
     */
    public function assignBadge($userId, $badgeId)
    {
        return $this->userRepository->assignBadge($userId, $badgeId);
    }

    /**
     * Get all users with their achievements (for admin)
     */
    public function getAllUsersWithAchievements()
    {
        return $this->userRepository->query()
            ->with(['achievements.achievement', 'badge'])
            ->get();
    }

    /**
     * Get all users with their achievements paginated (for admin)
     */
    public function getAllUsersWithAchievementsPaginated($page = 1, $limit = 10)
    {
        $query = $this->userRepository->query()
            ->with(['achievements.achievement', 'badge'])
            ->orderBy('created_at', 'desc');

        $total = $query->count();
        $totalPages = ceil($total / $limit);
        $offset = ($page - 1) * $limit;

        $users = $query->offset($offset)
            ->limit($limit)
            ->get();

        return [
            'users' => $users,
            'pagination' => [
                'page' => (int)$page,
                'limit' => (int)$limit,
                'total' => $total,
                'total_pages' => $totalPages,
            ]
        ];
    }
}