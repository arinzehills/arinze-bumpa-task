<?php

namespace App\Modules\LoyaltyService\Services;

use App\Modules\LoyaltyService\Repositories\BadgeRepository;
use App\Modules\UserService\Repositories\UserRepository;

class BadgeService
{
    protected $badgeRepository;
    protected $userRepository;

    public function __construct(
        BadgeRepository $badgeRepository,
        UserRepository $userRepository
    ) {
        $this->badgeRepository = $badgeRepository;
        $this->userRepository = $userRepository;
    }

    /**
     * Check and assign appropriate badge based on user's points
     */
    public function checkAndAssignBadge($userId)
    {
        $user = $this->userRepository->find($userId);
        $currentPoints = $user->total_points;

        // Get the highest badge user qualifies for
        $badge = $this->badgeRepository->getBadgeForPoints($currentPoints);

        if ($badge && $user->current_badge_id != $badge->id) {
            // Assign new badge
            $this->userRepository->assignBadge($userId, $badge->id);
            $this->userRepository->update(['current_badge_name' => $badge->name], $userId);

            return $badge;
        }

        return null; // No badge change
    }

    /**
     * Get all badges
     */
    public function getAllBadges()
    {
        return $this->badgeRepository->getAllBadges();
    }
}