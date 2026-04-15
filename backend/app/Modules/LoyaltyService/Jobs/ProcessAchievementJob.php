<?php

namespace App\Modules\LoyaltyService\Jobs;

use App\Modules\LoyaltyService\Events\AchievementUnlockedEvent;
use App\Modules\LoyaltyService\Events\BadgeUnlockedEvent;
use App\Modules\LoyaltyService\Services\AchievementService;
use App\Modules\LoyaltyService\Services\BadgeService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessAchievementJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $userId;
    public $purchaseData;

    /**
     * Create a new job instance
     */
    public function __construct($userId, $purchaseData)
    {
        $this->userId = $userId;
        $this->purchaseData = $purchaseData;
    }

    /**
     * Execute the job
     */
    public function handle(
        AchievementService $achievementService,
        BadgeService $badgeService
    ) {
        // Check and unlock achievements
        $unlockedAchievements = $achievementService->checkAndUnlockAchievements(
            $this->userId,
            $this->purchaseData
        );

        // Fire events for each unlocked achievement
        foreach ($unlockedAchievements as $achievement) {
            event(new AchievementUnlockedEvent($this->userId, $achievement));
        }

        // Check and assign badge based on updated points
        $newBadge = $badgeService->checkAndAssignBadge($this->userId);

        // Fire badge event if badge changed
        if ($newBadge) {
            event(new BadgeUnlockedEvent($this->userId, $newBadge));
        }
    }
}
