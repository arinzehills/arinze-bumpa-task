<?php

namespace App\Modules\LoyaltyService\Listeners;

use App\Modules\LoyaltyService\Events\BadgeUnlockedEvent;
use Illuminate\Support\Facades\Log;

class BadgeUnlockedListener
{
    /**
     * Handle the event
     */
    public function handle(BadgeUnlockedEvent $event)
    {
        // Log the badge upgrade
        Log::info('Badge unlocked', [
            'user_id' => $event->userId,
            'badge' => $event->badge->name,
            'threshold' => $event->badge->points_threshold
        ]);

        // TODO: Send notification to user
        // TODO: Broadcast to frontend (real-time update)
    }
}