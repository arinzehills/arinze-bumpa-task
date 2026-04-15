<?php

namespace App\Modules\LoyaltyService\Repositories;

use App\Repositories\BaseRepository;
use App\Modules\LoyaltyService\Models\Badge;

class BadgeRepository extends BaseRepository
{
    public function __construct(Badge $model)
    {
        parent::__construct($model);
    }

    /**
     * Get badge by points threshold
     */
    public function getBadgeForPoints($points)
    {
        return $this->query()
            ->where('points_threshold', '<=', $points)
            ->orderBy('points_threshold', 'desc')
            ->first();
    }

    /**
     * Get all badges ordered by threshold
     */
    public function getAllBadges()
    {
        return $this->query()
            ->orderBy('points_threshold', 'asc')
            ->get();
    }
}