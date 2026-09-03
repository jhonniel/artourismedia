<?php

namespace Tests\Feature;

use App\Models\User;
use App\Notifications\AdminResetPassword;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    public function test_forgot_password_sends_reset_notification(): void
    {
        Notification::fake();

        $user = User::factory()->create([
            'email' => 'reset@test.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        $response = $this->postJson('/api/admin/forgot-password', [
            'email' => $user->email,
        ]);

        $response->assertOk()
            ->assertJsonPath('success', true);

        Notification::assertSentTo($user, AdminResetPassword::class);
    }

    public function test_forgot_password_does_not_reveal_missing_email(): void
    {
        Notification::fake();

        $response = $this->postJson('/api/admin/forgot-password', [
            'email' => 'missing@test.com',
        ]);

        $response->assertOk()
            ->assertJsonPath('success', true);

        Notification::assertNothingSent();
    }

    public function test_password_can_be_reset_with_valid_token(): void
    {
        $user = User::factory()->create([
            'email' => 'reset2@test.com',
            'password' => Hash::make('old-password'),
            'role' => 'admin',
        ]);

        $token = Password::createToken($user);

        $response = $this->postJson('/api/admin/reset-password', [
            'email' => $user->email,
            'token' => $token,
            'password' => 'new-password-123',
            'password_confirmation' => 'new-password-123',
        ]);

        $response->assertOk()
            ->assertJsonPath('success', true);

        $user->refresh();

        $this->assertTrue(Hash::check('new-password-123', $user->password));
    }

    public function test_password_reset_fails_with_invalid_token(): void
    {
        $user = User::factory()->create([
            'email' => 'reset3@test.com',
            'password' => Hash::make('old-password'),
            'role' => 'admin',
        ]);

        $response = $this->postJson('/api/admin/reset-password', [
            'email' => $user->email,
            'token' => 'invalid-token',
            'password' => 'new-password-123',
            'password_confirmation' => 'new-password-123',
        ]);

        $response->assertStatus(422);
    }
}
