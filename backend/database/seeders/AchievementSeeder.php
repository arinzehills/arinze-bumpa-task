<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Modules\LoyaltyService\Models\Achievement;

class AchievementSeeder extends Seeder
{
    public function run()
    {
        $achievements = [
            [
                'name' => 'First Purchase',
                'description' => 'Made your very first purchase!',
                'criteria' => json_encode(['type' => 'first_purchase', 'value' => 1]),
                'points' => 50
            ],
            [
                'name' => 'Second Purchase',
                'description' => 'Coming back for more!',
                'criteria' => json_encode(['type' => 'purchase_count', 'value' => 2]),
                'points' => 50
            ],
            [
                'name' => 'Third Purchase',
                'description' => 'You\'re on a roll!',
                'criteria' => json_encode(['type' => 'purchase_count', 'value' => 3]),
                'points' => 50
            ],
            [
                'name' => 'Fifth Purchase',
                'description' => 'Regular customer status unlocked!',
                'criteria' => json_encode(['type' => 'purchase_count', 'value' => 5]),
                'points' => 100
            ],
            [
                'name' => 'Tenth Purchase',
                'description' => 'Loyal customer! We appreciate you.',
                'criteria' => json_encode(['type' => 'purchase_count', 'value' => 10]),
                'points' => 200
            ],
            [
                'name' => 'Big Spender',
                'description' => 'Spent over $100 total!',
                'criteria' => json_encode(['type' => 'total_spent', 'value' => 100]),
                'points' => 200
            ],
        ];

        foreach ($achievements as $achievement) {
            Achievement::create($achievement);
        }
    }
}