<?php

namespace App\Modules\LoyaltyService\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AchievementUnlockedEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $userId;
    public $achievement;

    public function __construct($userId, $achievement)
    {
        $this->userId = $userId;
        $this->achievement = $achievement;
    }
}