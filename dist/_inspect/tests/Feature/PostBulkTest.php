<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PostBulkTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
        Sanctum::actingAs(User::query()->first());
    }

    public function test_posts_can_be_bulk_published(): void
    {
        $authorId = User::query()->first()->id;

        $posts = collect([
            Post::query()->create([
                'title' => 'Bulk Draft One',
                'slug' => 'bulk-draft-one',
                'status' => 'draft',
                'author_id' => $authorId,
            ]),
            Post::query()->create([
                'title' => 'Bulk Draft Two',
                'slug' => 'bulk-draft-two',
                'status' => 'draft',
                'author_id' => $authorId,
            ]),
        ]);

        $response = $this->postJson('/api/admin/posts/bulk', [
            'uuids' => $posts->pluck('uuid')->all(),
            'action' => 'publish',
        ]);

        $response->assertOk()->assertJsonPath('data.count', 2);

        $this->assertEquals(2, Post::query()->whereIn('uuid', $posts->pluck('uuid'))->where('status', 'published')->count());
    }
}
