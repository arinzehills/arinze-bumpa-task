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

    /**
     * Get badges paginated
     */
    public function getBadgesPaginated($page = 1, $limit = 10)
    {
        $query = $this->query()->orderBy('points_threshold', 'asc');

        $total = $query->count();
        $totalPages = ceil($total / $limit);
        $offset = ($page - 1) * $limit;

        $badges = $query->offset($offset)
            ->limit($limit)
            ->get();

        return [
            'badges' => $badges,
            'pagination' => [
                'page' => (int)$page,
                'limit' => (int)$limit,
                'total' => $total,
                'total_pages' => $totalPages,
            ]
        ];
    }
}