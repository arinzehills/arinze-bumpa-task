<?php

namespace App\Modules\LoyaltyService\Repositories;

use App\Repositories\BaseRepository;
use App\Modules\LoyaltyService\Models\Achievement;

class AchievementRepository extends BaseRepository
{
    public function __construct(Achievement $model)
    {
        parent::__construct($model);
    }

    /**
     * Get all achievements
     */
    public function getAllAchievements()
    {
        return $this->all();
    }

    /**
     * Get achievement by criteria type
     */
    public function getAchievementByCriteria($criteriaType)
    {
        return $this->query()
            ->whereJsonContains('criteria->type', $criteriaType)
            ->get();
    }

    /**
     * Get achievements paginated
     */
    public function getAchievementsPaginated($page = 1, $limit = 10)
    {
        $query = $this->query()->orderBy('created_at', 'desc');

        $total = $query->count();
        $totalPages = ceil($total / $limit);
        $offset = ($page - 1) * $limit;

        $achievements = $query->offset($offset)
            ->limit($limit)
            ->get();

        return [
            'achievements' => $achievements,
            'pagination' => [
                'page' => (int)$page,
                'limit' => (int)$limit,
                'total' => $total,
                'total_pages' => $totalPages,
            ]
        ];
    }
}