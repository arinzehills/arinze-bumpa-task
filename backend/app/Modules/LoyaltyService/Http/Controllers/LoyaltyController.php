<?php

namespace App\Modules\LoyaltyService\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Modules\LoyaltyService\Repositories\AchievementRepository;
use App\Modules\LoyaltyService\Repositories\BadgeRepository;

class LoyaltyController extends BaseController
{
    protected $achievementRepository;
    protected $badgeRepository;

    public function __construct(
        AchievementRepository $achievementRepository,
        BadgeRepository $badgeRepository
    ) {
        $this->achievementRepository = $achievementRepository;
        $this->badgeRepository = $badgeRepository;
    }

    /**
     * Get all achievements
     * GET /api/v1/achievements
     */
    public function getAllAchievements()
    {
        try {
            $achievements = $this->achievementRepository->getAllAchievements();
            return $this->successResponse($achievements, 'Achievements retrieved successfully');
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Get all badges
     * GET /api/v1/badges
     */
    public function getAllBadges()
    {
        try {
            $badges = $this->badgeRepository->getAllBadges();
            return $this->successResponse($badges, 'Badges retrieved successfully');
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }
}