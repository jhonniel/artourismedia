<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Service;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PreviewTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_project_preview_requires_valid_token(): void
    {
        $project = Project::query()->firstOrFail();

        Sanctum::actingAs(User::query()->first());

        $response = $this->postJson("/api/admin/projects/{$project->uuid}/preview-token");
        $token = $response->json('data.token');

        $this->getJson("/api/projects/preview/{$project->uuid}?token={$token}")
            ->assertOk()
            ->assertJsonPath('data.title', $project->title);

        $this->getJson("/api/projects/preview/{$project->uuid}?token=invalid")
            ->assertForbidden();
    }

    public function test_service_preview_requires_valid_token(): void
    {
        $service = Service::query()->firstOrFail();

        Sanctum::actingAs(User::query()->first());

        $response = $this->postJson("/api/admin/services/{$service->uuid}/preview-token");
        $token = $response->json('data.token');

        $this->getJson("/api/services/preview/{$service->uuid}?token={$token}")
            ->assertOk()
            ->assertJsonPath('data.title', $service->title);

        $this->getJson("/api/services/preview/{$service->uuid}?token=invalid")
            ->assertForbidden();
    }

    public function test_about_page_includes_metadata(): void
    {
        $this->getJson('/api/pages/about')
            ->assertOk()
            ->assertJsonPath('data.metadata.values.0.title', 'Purpose-Led Strategy')
            ->assertJsonPath('data.metadata.team.0.name', 'Maria Santos');
    }
}
