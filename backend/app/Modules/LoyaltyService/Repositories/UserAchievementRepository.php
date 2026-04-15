<?php

namespace App\Modules\LoyaltyService\Repositories;

use App\Repositories\BaseRepository;
use App\Modules\LoyaltyService\Models\UserAchievement;

class UserAchievementRepository extends BaseRepository
{
    public function __construct(UserAchievement $model)
    {
        parent::__construct($model);
    }

    /**
     * Get user's achievements
     */
    public function getUserAchievements($userId)
    {
        return $this->query()
            ->where('user_id', $userId)
            ->with('achievement')
            ->get();
    }

    /**
     * Unlock achievement for user
     */
    public function unlockAchievement($userId, $achievementId)
    {
        return $this->create([
            'user_id' => $userId,
            'achievement_id' => $achievementId,
            'unlocked_at' => now(),
            'progress' => 100
        ]);
    }

    /**
     * Check if user has achievement
     */
    public function hasAchievement($userId, $achievementId)
    {
        return $this->query()
            ->where('user_id', $userId)
            ->where('achievement_id', $achievementId)
            ->exists();
    }
}