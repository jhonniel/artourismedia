<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PostCrudTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
        $this->admin = User::query()->first();
        Sanctum::actingAs($this->admin);
    }

    public function test_admin_can_create_update_and_delete_post(): void
    {
        $createResponse = $this->postJson('/api/admin/posts', [
            'title' => 'CRUD Test Post',
            'slug' => 'crud-test-post',
            'excerpt' => 'A test excerpt',
            'content' => '<p>Test content</p>',
            'status' => 'draft',
        ]);

        $createResponse->assertCreated()
            ->assertJsonPath('data.title', 'CRUD Test Post');

        $uuid = $createResponse->json('data.uuid');

        $this->putJson("/api/admin/posts/{$uuid}", [
            'title' => 'Updated CRUD Post',
            'status' => 'published',
        ])->assertOk()
            ->assertJsonPath('data.title', 'Updated CRUD Post')
            ->assertJsonPath('data.status', 'published');

        $this->deleteJson("/api/admin/posts/{$uuid}")
            ->assertOk();

        $this->assertSoftDeleted('posts', ['uuid' => $uuid]);
    }

    public function test_draft_post_is_not_public(): void
    {
        $post = Post::query()->create([
            'title' => 'Hidden Draft',
            'slug' => 'hidden-draft',
            'status' => 'draft',
            'author_id' => $this->admin->id,
        ]);

        $this->getJson('/api/posts/hidden-draft')->assertNotFound();

        $preview = $this->postJson("/api/admin/posts/{$post->uuid}/preview-token");
        $token = $preview->json('data.token');

        $this->getJson("/api/posts/preview/{$post->uuid}?token={$token}")
            ->assertOk()
            ->assertJsonPath('data.title', 'Hidden Draft');
    }

    public function test_published_post_is_public(): void
    {
        Post::query()->create([
            'title' => 'Public Post',
            'slug' => 'public-post',
            'status' => 'published',
            'published_at' => now(),
            'author_id' => $this->admin->id,
        ]);

        $this->getJson('/api/posts/public-post')
            ->assertOk()
            ->assertJsonPath('data.title', 'Public Post');
    }
}
