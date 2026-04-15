<?php

namespace App\Modules\UserService\Repositories;

use App\Repositories\BaseRepository;
use App\Modules\UserService\Models\User;

class UserRepository extends BaseRepository
{
    public function __construct(User $model)
    {
        parent::__construct($model);
    }

    /**
     * Find user by email
     */
    public function findByEmail(string $email)
    {
        return $this->query()->where('email', $email)->first();
    }

    /**
     * Get user with achievements
     */
    public function getUserWithAchievements($userId)
    {
        return $this->query()
            ->with(['achievements.achievement', 'badge'])
            ->findOrFail($userId);
    }

    /**
     * Update user's total points
     */
    public function updatePoints($userId, $points)
    {
        $user = $this->find($userId);
        $user->total_points += $points;
        $user->save();
        return $user;
    }

    /**
     * Assign badge to user
     */
    public function assignBadge($userId, $badgeId)
    {
        return $this->update(['current_badge_id' => $badgeId], $userId);
    }
}