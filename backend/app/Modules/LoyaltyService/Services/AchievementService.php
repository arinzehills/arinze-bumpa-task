<?php

namespace App\Modules\LoyaltyService\Services;

use App\Modules\LoyaltyService\Repositories\AchievementRepository;
use App\Modules\LoyaltyService\Repositories\UserAchievementRepository;
use App\Modules\UserService\Repositories\UserRepository;

class AchievementService
{
    protected $achievementRepository;
    protected $userAchievementRepository;
    protected $userRepository;

    public function __construct(
        AchievementRepository $achievementRepository,
        UserAchievementRepository $userAchievementRepository,
        UserRepository $userRepository
    ) {
        $this->achievementRepository = $achievementRepository;
        $this->userAchievementRepository = $userAchievementRepository;
        $this->userRepository = $userRepository;
    }

    /**
     * Check and unlock achievements for user based on purchase
     */
    public function checkAndUnlockAchievements($userId, $purchaseData)
    {
        $achievements = $this->achievementRepository->getAllAchievements();
        $unlockedAchievements = [];

        foreach ($achievements as $achievement) {
            // Skip if already unlocked
            if ($this->userAchievementRepository->hasAchievement($userId, $achievement->id)) {
                continue;
            }

            // Check if criteria met
            $criteriaMet = $this->checkCriteria($userId, $achievement->criteria, $purchaseData);

            if ($criteriaMet) {
                // Unlock achievement
                $this->userAchievementRepository->unlockAchievement($userId, $achievement->id);

                // Add points to user
                $this->userRepository->updatePoints($userId, $achievement->points);

                $unlockedAchievements[] = $achievement;
            }
        }

        return $unlockedAchievements;
    }

    /**
     * Check if achievement criteria is met
     */
    protected function checkCriteria($userId, $criteria, $purchaseData)
    {
        $type = $criteria['type'] ?? null;
        $value = $criteria['value'] ?? null;

        switch ($type) {
            case 'first_purchase':
                // Check if user has no achievements yet (this is their first)
                $achievementCount = $this->userAchievementRepository->getUserAchievements($userId)->count();
                return $achievementCount == 0;

            case 'purchase_count':
                // Check total purchase count (you'd get this from PaymentService)
                // For now, simplified check
                return true; // Will implement properly when PaymentService is ready

            case 'total_spent':
                // Check total amount spent
                // Will implement when PaymentService is ready
                return true;

            default:
                return false;
        }
    }

    /**
     * Get user's achievements
     */
    public function getUserAchievements($userId)
    {
        return $this->userAchievementRepository->getUserAchievements($userId);
    }
}