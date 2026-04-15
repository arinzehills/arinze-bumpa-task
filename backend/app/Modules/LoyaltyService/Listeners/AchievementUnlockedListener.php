<?php

namespace App\Modules\LoyaltyService\Listeners;

use App\Modules\LoyaltyService\Events\AchievementUnlockedEvent;
use Illuminate\Support\Facades\Log;

class AchievementUnlockedListener
{
    /**
     * Handle the event
     */
    public function handle(AchievementUnlockedEvent $event)
    {
        // Log the achievement unlock
        Log::info('Achievement unlocked', [
            'user_id' => $event->userId,
            'achievement' => $event->achievement->name,
            'points' => $event->achievement->points
        ]);

        // TODO: Send notification to user
        // TODO: Broadcast to frontend (real-time update)
    }
}