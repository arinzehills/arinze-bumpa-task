<?php

namespace App\Modules\LoyaltyService\Models;

use Illuminate\Database\Eloquent\Model;

class Achievement extends Model
{
    protected $fillable = [
        'name',
        'description',
        'criteria',
        'points'
    ];

    protected $casts = [
        'criteria' => 'array',
        'points' => 'integer'
    ];

    /**
     * Users who unlocked this achievement
     */
    public function users()
    {
        return $this->belongsToMany(
            'App\Modules\UserService\Models\User',
            'user_achievements'
        )->withTimestamps()->withPivot('unlocked_at');
    }
}