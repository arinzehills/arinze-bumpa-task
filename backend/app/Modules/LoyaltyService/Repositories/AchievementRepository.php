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
}