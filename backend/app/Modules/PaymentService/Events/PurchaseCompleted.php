<?php

namespace App\Modules\PaymentService\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PurchaseCompleted
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $userId;
    public $productId;
    public $amount;
    public $cashbackPoints;

    /**
     * Create a new event instance.
     */
    public function __construct($userId, $productId, $amount, $cashbackPoints)
    {
        $this->userId = $userId;
        $this->productId = $productId;
        $this->amount = $amount;
        $this->cashbackPoints = $cashbackPoints;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('channel-name'),
        ];
    }
}