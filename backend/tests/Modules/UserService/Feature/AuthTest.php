<?php

namespace Tests\Modules\UserService\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test user can register successfully
     */
    public function test_user_can_register()
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123'
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'User registered successfully'
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'john@example.com'
        ]);
    }

    /**
     * Test user can login successfully
     */
    public function test_user_can_login()
    {
        // First create a user
        $this->postJson('/api/v1/auth/register', [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123'
        ]);

        // Now login with the same credentials
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'jane@example.com',
            'password' => 'password123'
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Login successful'
            ])
            ->assertJsonStructure([
                'data' => ['user', 'token']
            ]);
    }

    /**
     * Test login fails with wrong password
     */
    public function test_login_fails_with_wrong_password()
    {
        // Create a user
        $this->postJson('/api/v1/auth/register', [
            'name' => 'Bob Smith',
            'email' => 'bob@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123'
        ]);

        // Try to login with wrong password
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'bob@example.com',
            'password' => 'wrongpassword'
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => 'Invalid credentials'
            ]);
    }
}