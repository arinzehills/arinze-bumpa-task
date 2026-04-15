<?php

namespace Tests\Modules\LoyaltyService\Unit;

use App\Modules\LoyaltyService\Models\Achievement;
use App\Modules\LoyaltyService\Models\UserAchievement;
use App\Modules\LoyaltyService\Repositories\AchievementRepository;
use App\Modules\LoyaltyService\Repositories\UserAchievementRepository;
use App\Modules\LoyaltyService\Services\AchievementService;
use App\Modules\UserService\Models\User;
use App\Modules\UserService\Repositories\UserRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AchievementServiceTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test achievement service can unlock achievement
     */
    public function test_can_unlock_first_purchase_achievement()
    {
        // Create a user
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
            'total_points' => 0
        ]);

        // Create achievement
        $achievement = Achievement::create([
            'name' => 'First Purchase',
            'description' => 'Made first purchase',
            'criteria' => ['type' => 'first_purchase', 'value' => 1],
            'points' => 50
        ]);

        // Create service
        $achievementRepository = new AchievementRepository(new Achievement());
        $userAchievementRepository = new UserAchievementRepository(new UserAchievement());
        $userRepository = new UserRepository(new User());

        $achievementService = new AchievementService(
            $achievementRepository,
            $userAchievementRepository,
            $userRepository
        );

        // Unlock achievement
        $purchaseData = ['amount' => 100, 'product_id' => 1];
        $unlocked = $achievementService->checkAndUnlockAchievements($user->id, $purchaseData);

        // Assert achievement was unlocked
        $this->assertNotEmpty($unlocked);
        $this->assertEquals('First Purchase', $unlocked[0]->name);

        // Assert user has the achievement
        $userAchievements = $achievementService->getUserAchievements($user->id);
        $this->assertCount(1, $userAchievements);
    }
}