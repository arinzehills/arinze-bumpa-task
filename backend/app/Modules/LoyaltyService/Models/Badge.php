<?php

namespace App\Modules\LoyaltyService\Models;

use Illuminate\Database\Eloquent\Model;

class Badge extends Model
{
    protected $fillable = [
        'name',
        'description',
        'points_threshold'
    ];

    protected $casts = [
        'points_threshold' => 'integer'
    ];

    /**
     * Users who have this badge
     */
    public function users()
    {
        return $this->hasMany('App\Modules\UserService\Models\User', 'current_badge_id');
    }
}