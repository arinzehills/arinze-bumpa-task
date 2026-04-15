<?php

namespace Tests\Modules\UserService\Feature;

use App\Modules\UserService\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

class AdminAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test admin user can access admin endpoints
     */
    public function test_admin_user_can_access_admin_endpoints()
    {
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
            'user_type' => 'admin',
            'role' => 'admin'
        ]);

        $token = JWTAuth::fromUser($admin);

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token}"
        ])->getJson('/api/v1/admin/users/achievements');

        $response->assertStatus(200);
    }

    /**
     * Test super admin user can access admin endpoints
     */
    public function test_super_admin_user_can_access_admin_endpoints()
    {
        $superAdmin = User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@test.com',
            'password' => bcrypt('password'),
            'user_type' => 'admin',
            'role' => 'super_admin'
        ]);

        $token = JWTAuth::fromUser($superAdmin);

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token}"
        ])->getJson('/api/v1/admin/users/achievements');

        $response->assertStatus(200);
    }

    /**
     * Test regular user cannot access admin endpoints
     */
    public function test_regular_user_cannot_access_admin_endpoints()
    {
        $user = User::create([
            'name' => 'Regular User',
            'email' => 'user@test.com',
            'password' => bcrypt('password'),
            'user_type' => 'user',
            'role' => 'admin'
        ]);

        $token = JWTAuth::fromUser($user);

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token}"
        ])->getJson('/api/v1/admin/users/achievements');

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'Forbidden - Admin access required'
            ]);
    }

    /**
     * Test vendor user cannot access admin endpoints
     */
    public function test_vendor_user_cannot_access_admin_endpoints()
    {
        $vendor = User::create([
            'name' => 'Vendor',
            'email' => 'vendor@test.com',
            'password' => bcrypt('password'),
            'user_type' => 'vendor',
            'role' => 'admin'
        ]);

        $token = JWTAuth::fromUser($vendor);

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token}"
        ])->getJson('/api/v1/admin/users/achievements');

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'Forbidden - Admin access required'
            ]);
    }

    /**
     * Test unauthenticated user cannot access admin endpoints
     */
    public function test_unauthenticated_user_cannot_access_admin_endpoints()
    {
        $response = $this->getJson('/api/v1/admin/users/achievements');

        $response->assertStatus(401);
    }
}