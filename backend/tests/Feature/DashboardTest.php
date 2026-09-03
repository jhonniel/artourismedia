<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_dashboard_returns_expected_shape(): void
    {
        Sanctum::actingAs(User::query()->first());

        $response = $this->getJson('/api/admin/dashboard');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'data' => [
                    'stats' => ['posts', 'projects', 'services', 'messages', 'subscribers'],
                    'recent_posts',
                    'recent_projects',
                    'recent_messages',
                ],
            ]);
    }
}
