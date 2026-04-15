<?php

namespace Tests\Modules\LoyaltyService\Unit;

use App\Modules\LoyaltyService\Models\Badge;
use App\Modules\LoyaltyService\Repositories\BadgeRepository;
use App\Modules\LoyaltyService\Services\BadgeService;
use App\Modules\UserService\Models\User;
use App\Modules\UserService\Repositories\UserRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BadgeServiceTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test badge service assigns correct badge based on points
     */
    public function test_assigns_correct_badge_based_on_points()
    {
        // Create badges
        $bronze = Badge::create([
            'name' => 'Bronze',
            'description' => 'Starter badge',
            'points_threshold' => 0
        ]);

        $silver = Badge::create([
            'name' => 'Silver',
            'description' => 'First upgrade',
            'points_threshold' => 50
        ]);

        $gold = Badge::create([
            'name' => 'Gold',
            'description' => 'Mid-tier',
            'points_threshold' => 150
        ]);

        // Create user with 75 points (should get Silver)
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
            'total_points' => 75,
            'current_badge_id' => $bronze->id,
            'current_badge_name' => 'Bronze'
        ]);

        // Create service
        $badgeRepository = new BadgeRepository(new Badge());
        $userRepository = new UserRepository(new User());
        $badgeService = new BadgeService($badgeRepository, $userRepository);

        // Check and assign badge
        $newBadge = $badgeService->checkAndAssignBadge($user->id);

        // Assert Silver badge was assigned
        $this->assertNotNull($newBadge);
        $this->assertEquals('Silver', $newBadge->name);

        // Verify user badge was updated
        $user->refresh();
        $this->assertEquals($silver->id, $user->current_badge_id);
        $this->assertEquals('Silver', $user->current_badge_name);
    }

    /**
     * Test badge service doesn't change badge if threshold not met
     */
    public function test_does_not_change_badge_if_no_upgrade_needed()
    {
        // Create badges
        $bronze = Badge::create([
            'name' => 'Bronze',
            'description' => 'Starter',
            'points_threshold' => 0
        ]);

        Badge::create([
            'name' => 'Silver',
            'description' => 'Upgrade',
            'points_threshold' => 50
        ]);

        // Create user with 30 points (not enough for Silver)
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
            'total_points' => 30,
            'current_badge_id' => $bronze->id,
            'current_badge_name' => 'Bronze'
        ]);

        $badgeRepository = new BadgeRepository(new Badge());
        $userRepository = new UserRepository(new User());
        $badgeService = new BadgeService($badgeRepository, $userRepository);

        // Check badge
        $newBadge = $badgeService->checkAndAssignBadge($user->id);

        // Assert no badge change
        $this->assertNull($newBadge);

        // User still has Bronze
        $user->refresh();
        $this->assertEquals('Bronze', $user->current_badge_name);
    }
}