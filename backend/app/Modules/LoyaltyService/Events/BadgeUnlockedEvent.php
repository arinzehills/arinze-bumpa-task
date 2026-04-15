<?php

namespace App\Modules\LoyaltyService\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BadgeUnlockedEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $userId;
    public $badge;

    public function __construct($userId, $badge)
    {
        $this->userId = $userId;
        $this->badge = $badge;
    }
}