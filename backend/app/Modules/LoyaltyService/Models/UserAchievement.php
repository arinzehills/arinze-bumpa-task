<?php

namespace App\Modules\LoyaltyService\Models;

use Illuminate\Database\Eloquent\Model;

class UserAchievement extends Model
{
    protected $fillable = [
        'user_id',
        'achievement_id',
        'unlocked_at',
        'progress'
    ];

    protected $casts = [
        'unlocked_at' => 'datetime',
        'progress' => 'integer'
    ];

    /**
     * User relationship
     */
    public function user()
    {
        return $this->belongsTo('App\Modules\UserService\Models\User');
    }

    /**
     * Achievement relationship
     */
    public function achievement()
    {
        return $this->belongsTo(Achievement::class);
    }
}