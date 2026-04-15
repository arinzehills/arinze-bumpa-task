<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Modules\LoyaltyService\Models\Badge;

class BadgeSeeder extends Seeder
{
    public function run()
    {
        $badges = [
            [
                'name' => 'Bronze',
                'description' => 'Welcome! Your journey begins here.',
                'points_threshold' => 0
            ],
            [
                'name' => 'Silver',
                'description' => 'Great start! You\'re building momentum.',
                'points_threshold' => 50
            ],
            [
                'name' => 'Gold',
                'description' => 'Impressive! You\'re a valued customer.',
                'points_threshold' => 150
            ],
            [
                'name' => 'Platinum',
                'description' => 'Outstanding! You\'re among our best customers.',
                'points_threshold' => 300
            ],
            [
                'name' => 'Diamond',
                'description' => 'Elite status! You\'re a VIP member.',
                'points_threshold' => 500
            ],
        ];

        foreach ($badges as $badge) {
            Badge::create($badge);
        }
    }
}