<?php

namespace Tests\Feature;

use App\Models\Service;
use App\Models\ServiceVideo;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ServiceVideoTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_public_mindanao_connect_service_includes_active_videos(): void
    {
        $response = $this->getJson('/api/services/mindanao-connect');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.slug', 'mindanao-connect')
            ->assertJsonPath('data.videos.0.youtube_id', 'hPBoDRcv-5U')
            ->assertJsonPath('data.videos.0.thumbnail_url', 'https://img.youtube.com/vi/hPBoDRcv-5U/hqdefault.jpg');
    }

    public function test_admin_can_create_mindanao_connect_video(): void
    {
        $admin = User::query()->where('role', 'admin')->firstOrFail();

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/admin/mindanao-connect/videos', [
            'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'title' => 'Sample Mindanao Video',
            'description' => 'Preview thumbnail only on the website.',
            'is_active' => true,
        ]);

        $response->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.youtube_id', 'dQw4w9WgXcQ');

        $service = Service::query()->where('slug', 'mindanao-connect')->firstOrFail();

        $this->assertDatabaseHas('service_videos', [
            'service_id' => $service->id,
            'title' => 'Sample Mindanao Video',
            'youtube_id' => 'dQw4w9WgXcQ',
        ]);
    }

    public function test_admin_rejects_invalid_youtube_url(): void
    {
        $admin = User::query()->where('role', 'admin')->firstOrFail();

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/admin/mindanao-connect/videos', [
            'youtube_url' => 'https://example.com/not-youtube',
            'title' => 'Invalid Video',
        ]);

        $response->assertUnprocessable();
    }

    public function test_inactive_videos_are_hidden_from_public_service(): void
    {
        ServiceVideo::query()->update(['is_active' => false]);

        $response = $this->getJson('/api/services/mindanao-connect');

        $response->assertOk()
            ->assertJsonPath('data.videos', []);
    }
}
