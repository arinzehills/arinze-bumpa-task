<?php

namespace App\Modules\LoyaltyService\Listeners;

use App\Modules\PaymentService\Events\PurchaseCompleted;
use App\Modules\LoyaltyService\Services\AchievementService;
use App\Modules\LoyaltyService\Services\BadgeService;

class AwardAchievementsOnPurchase
{
    protected $achievementService;
    protected $badgeService;

    /**
     * Create the event listener.
     */
    public function __construct(
        AchievementService $achievementService,
        BadgeService $badgeService
    ) {
        $this->achievementService = $achievementService;
        $this->badgeService = $badgeService;
    }

    /**
     * Handle the event.
     */
    public function handle(PurchaseCompleted $event): void
    {
        // Check and unlock achievements based on purchase
        $purchaseData = [
            'amount' => $event->amount,
            'product_id' => $event->productId,
            'points' => $event->cashbackPoints
        ];

        $this->achievementService->checkAndUnlockAchievements(
            $event->userId,
            $purchaseData
        );

        // Check and assign badge based on new points
        $this->badgeService->checkAndAssignBadge($event->userId);
    }
}
