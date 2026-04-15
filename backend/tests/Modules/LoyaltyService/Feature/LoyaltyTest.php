<?php

namespace Tests\Modules\LoyaltyService\Feature;

use App\Modules\LoyaltyService\Models\Achievement;
use App\Modules\LoyaltyService\Models\Badge;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoyaltyTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test can get all achievements
     */
    public function test_can_get_all_achievements()
    {
        // Create sample achievements
        Achievement::create([
            'name' => 'First Purchase',
            'description' => 'Made your first purchase',
            'criteria' => ['type' => 'first_purchase', 'value' => 1],
            'points' => 50
        ]);

        Achievement::create([
            'name' => 'Big Spender',
            'description' => 'Spent over $100',
            'criteria' => ['type' => 'total_spent', 'value' => 100],
            'points' => 200
        ]);

        $response = $this->getJson('/api/v1/achievements');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Achievements retrieved successfully'
            ])
            ->assertJsonCount(2, 'data.items');
    }

    /**
     * Test can get all badges
     */
    public function test_can_get_all_badges()
    {
        // Create sample badges
        Badge::create([
            'name' => 'Bronze',
            'description' => 'Welcome badge',
            'points_threshold' => 0
        ]);

        Badge::create([
            'name' => 'Silver',
            'description' => 'First upgrade',
            'points_threshold' => 50
        ]);

        Badge::create([
            'name' => 'Gold',
            'description' => 'Mid-tier badge',
            'points_threshold' => 150
        ]);

        $response = $this->getJson('/api/v1/badges');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Badges retrieved successfully'
            ])
            ->assertJsonCount(3, 'data.items');
    }
}