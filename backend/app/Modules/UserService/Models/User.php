<?php

namespace App\Modules\UserService\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable;

    // User Types
    const TYPE_ADMIN = 'admin';
    const TYPE_USER = 'user';
    const TYPE_VENDOR = 'vendor';

    // Roles
    const ROLE_ADMIN = 'admin';
    const ROLE_SUPER_ADMIN = 'super_admin';

    protected $fillable = [
        'name',
        'email',
        'password',
        'user_type',
        'role',
        'total_points',
        'current_badge_id',
        'current_badge_name',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'total_points' => 'integer',
    ];

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    /**
     * User's achievements relationship
     */
    public function achievements()
    {
        return $this->hasMany('App\Modules\LoyaltyService\Models\UserAchievement');
    }

    /**
     * User's current badge relationship
     */
    public function badge()
    {
        return $this->belongsTo('App\Modules\LoyaltyService\Models\Badge', 'current_badge_id');
    }
}
