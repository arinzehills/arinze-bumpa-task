<?php

namespace Tests\Modules\UserService\Unit;

use App\Modules\UserService\Models\User;
use App\Modules\UserService\Repositories\UserRepository;
use App\Modules\UserService\Services\UserService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserServiceTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test UserService can create a user
     */
    public function test_create_user_hashes_password_and_sets_defaults()
    {
        $userRepository = new UserRepository(new User());
        $userService = new UserService($userRepository);

        $userData = [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'password' => 'plainpassword123'
        ];

        $user = $userService->createUser($userData);

        // Assert user was created
        $this->assertInstanceOf(User::class, $user);
        $this->assertEquals('Jane Doe', $user->name);
        $this->assertEquals('jane@example.com', $user->email);

        // Assert password was hashed (not plain text)
        $this->assertNotEquals('plainpassword123', $user->password);
        $this->assertTrue(strlen($user->password) > 20); // Hashed passwords are longer

        // Assert defaults were set
        $this->assertEquals(0, $user->total_points);
    }

    /**
     * Test UserService can get user profile
     */
    public function test_get_user_profile_returns_user()
    {
        $userRepository = new UserRepository(new User());
        $userService = new UserService($userRepository);

        // Create a user first
        $user = $userService->createUser([
            'name' => 'Alice Smith',
            'email' => 'alice@example.com',
            'password' => 'password123'
        ]);

        // Get the user profile
        $profile = $userService->getUserProfile($user->id);

        $this->assertInstanceOf(User::class, $profile);
        $this->assertEquals('Alice Smith', $profile->name);
        $this->assertEquals('alice@example.com', $profile->email);
    }

    /**
     * Test UserService can add points to user
     */
    public function test_add_points_increases_user_points()
    {
        $userRepository = new UserRepository(new User());
        $userService = new UserService($userRepository);

        // Create a user
        $user = $userService->createUser([
            'name' => 'Bob Johnson',
            'email' => 'bob@example.com',
            'password' => 'password123'
        ]);

        $this->assertEquals(0, $user->total_points);

        // Add points
        $updatedUser = $userService->addPoints($user->id, 50);

        $this->assertEquals(50, $updatedUser->total_points);

        // Add more points
        $updatedUser = $userService->addPoints($user->id, 25);

        $this->assertEquals(75, $updatedUser->total_points);
    }
}