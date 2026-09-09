<?php

namespace Tests\Feature;

use App\Models\ContactSubmission;
use App\Models\Project;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class FilterTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
        Sanctum::actingAs(User::query()->first());
    }

    public function test_contact_submissions_can_be_filtered_by_status_and_date(): void
    {
        ContactSubmission::query()->create([
            'name' => 'Old New',
            'email' => 'old-new@test.com',
            'message' => 'Hello',
            'status' => 'new',
            'created_at' => now()->subDays(10),
        ]);

        ContactSubmission::query()->create([
            'name' => 'Recent Read',
            'email' => 'recent-read@test.com',
            'message' => 'Hello',
            'status' => 'read',
            'read_at' => now(),
            'created_at' => now()->subDay(),
        ]);

        $response = $this->getJson('/api/admin/contact-submissions?status=read&date_from='.now()->subDays(2)->toDateString());

        $response->assertOk();
        $this->assertCount(1, $response->json('data.items'));
        $this->assertSame('Recent Read', $response->json('data.items.0.name'));
    }

    public function test_projects_can_be_filtered_by_publish_and_featured_state(): void
    {
        Project::query()->create([
            'title' => 'Draft Project',
            'slug' => 'draft-project',
            'is_published' => false,
            'is_featured' => false,
        ]);

        Project::query()->create([
            'title' => 'Featured Live',
            'slug' => 'featured-live',
            'is_published' => true,
            'is_featured' => true,
        ]);

        $response = $this->getJson('/api/admin/projects?search=Featured Live&is_published=1&is_featured=1');

        $response->assertOk();
        $this->assertCount(1, $response->json('data.items'));
        $this->assertSame('Featured Live', $response->json('data.items.0.title'));
    }
}
