<?php

namespace Database\Seeders;

use App\Modules\UserService\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create super admin
        User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@loyalty.com',
            'password' => bcrypt('password'),
            'user_type' => 'admin',
            'role' => 'super_admin',
            'total_points' => 0
        ]);

        // Create admin
        User::create([
            'name' => 'Admin',
            'email' => 'admin@loyalty.com',
            'password' => bcrypt('password'),
            'user_type' => 'admin',
            'role' => 'admin',
            'total_points' => 0
        ]);

        // Create vendor (like Konga, Jumia)
        User::create([
            'name' => 'Konga Vendor',
            'email' => 'vendor@konga.com',
            'password' => bcrypt('password'),
            'user_type' => 'vendor',
            'role' => 'admin',
            'total_points' => 0
        ]);

        // Create regular user
        User::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => bcrypt('password'),
            'user_type' => 'user',
            'role' => 'admin',
            'total_points' => 0
        ]);

        // Create another regular user
        User::create([
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'password' => bcrypt('password'),
            'user_type' => 'user',
            'role' => 'admin',
            'total_points' => 0
        ]);
    }
}