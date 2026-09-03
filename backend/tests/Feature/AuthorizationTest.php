<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthorizationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_author_cannot_access_settings(): void
    {
        $author = User::query()->create([
            'name' => 'Author User',
            'email' => 'author@test.com',
            'password' => Hash::make('password'),
            'role' => 'author',
        ]);

        Sanctum::actingAs($author);

        $this->getJson('/api/admin/settings')->assertForbidden();
    }

    public function test_author_can_only_see_own_posts(): void
    {
        $admin = User::query()->first();
        $author = User::query()->create([
            'name' => 'Author User',
            'email' => 'author2@test.com',
            'password' => Hash::make('password'),
            'role' => 'author',
        ]);

        Post::query()->create([
            'title' => 'Admin Post',
            'slug' => 'admin-post',
            'status' => 'draft',
            'author_id' => $admin->id,
        ]);

        Post::query()->create([
            'title' => 'Author Post',
            'slug' => 'author-post',
            'status' => 'draft',
            'author_id' => $author->id,
        ]);

        Sanctum::actingAs($author);

        $response = $this->getJson('/api/admin/posts');

        $response->assertOk();
        $this->assertCount(1, $response->json('data.items'));
        $this->assertSame('Author Post', $response->json('data.items.0.title'));
    }

    public function test_editor_can_access_pages(): void
    {
        $editor = User::query()->create([
            'name' => 'Editor User',
            'email' => 'editor@test.com',
            'password' => Hash::make('password'),
            'role' => 'editor',
        ]);

        Sanctum::actingAs($editor);

        $this->getJson('/api/admin/pages')->assertOk();
    }

    public function test_author_cannot_access_pages(): void
    {
        $author = User::query()->create([
            'name' => 'Author User',
            'email' => 'author3@test.com',
            'password' => Hash::make('password'),
            'role' => 'author',
        ]);

        Sanctum::actingAs($author);

        $this->getJson('/api/admin/pages')->assertForbidden();
    }

    public function test_author_cannot_edit_other_users_post(): void
    {
        $admin = User::query()->first();
        $author = User::query()->create([
            'name' => 'Author User',
            'email' => 'author4@test.com',
            'password' => Hash::make('password'),
            'role' => 'author',
        ]);

        $post = Post::query()->create([
            'title' => 'Admin Post',
            'slug' => 'admin-post-edit',
            'status' => 'draft',
            'author_id' => $admin->id,
        ]);

        Sanctum::actingAs($author);

        $this->putJson("/api/admin/posts/{$post->uuid}", [
            'title' => 'Hacked Title',
        ])->assertNotFound();
    }
}
