<?php

namespace App\Modules\LoyaltyService\Http\Controllers;

use App\Http\Controllers\BaseController;
use App\Modules\LoyaltyService\Repositories\AchievementRepository;
use App\Modules\LoyaltyService\Repositories\BadgeRepository;
use Illuminate\Http\Request;

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
     * GET /api/v1/achievements?page=1&limit=10
     */
    public function getAllAchievements(Request $request)
    {
        try {
            $page = $request->query('page', 1);
            $limit = $request->query('limit', 10);

            $result = $this->achievementRepository->getAchievementsPaginated($page, $limit);
            return $this->paginatedResponse(
                $result['achievements'],
                $result['pagination'],
                'Achievements retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Get all badges
     * GET /api/v1/badges?page=1&limit=10
     */
    public function getAllBadges(Request $request)
    {
        try {
            $page = $request->query('page', 1);
            $limit = $request->query('limit', 10);

            $result = $this->badgeRepository->getBadgesPaginated($page, $limit);
            return $this->paginatedResponse(
                $result['badges'],
                $result['pagination'],
                'Badges retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }
}