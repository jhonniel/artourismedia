<?php

namespace App\Services;

use App\Models\Post;
use App\Models\User;
use App\Support\PreviewToken;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

class PostService extends CrudService
{
    public function __construct(
        ActivityLogService $activityLog,
        CacheService $cacheService,
        protected HtmlSanitizer $htmlSanitizer,
    ) {
        parent::__construct(new Post, $activityLog, 'post', $cacheService);
    }

    protected function shouldFlushPublicCache(): bool
    {
        return true;
    }

    public function paginate(int $perPage = 15, array $filters = []): mixed
    {
        $page = (int) ($filters['page'] ?? 1);

        return $this->applyFilters(
            $this->scopedQuery()->with(['category', 'author', 'tags']),
            $filters
        )->latest('published_at')->paginate(perPage: $perPage, page: $page);
    }

    public function findByUuid(string $uuid): Post
    {
        return $this->scopedQuery()->where('uuid', $uuid)->firstOrFail();
    }

    protected function scopedQuery(): Builder
    {
        $query = $this->query();
        $user = auth()->user();

        if ($user instanceof User && $user->isAuthor()) {
            $query->where('author_id', $user->id);
        }

        return $query;
    }

    public function getPublicPosts(array $filters = []): mixed
    {
        $query = Post::query()
            ->published()
            ->with(['category', 'author', 'tags'])
            ->latest('published_at');

        if (! empty($filters['category'])) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $filters['category']));
        }

        if (! empty($filters['tag'])) {
            $query->whereHas('tags', fn ($q) => $q->where('slug', $filters['tag']));
        }

        if (! empty($filters['featured'])) {
            $query->where('is_featured', true);
        }

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%");
            });
        }

        return $query->paginate(
            perPage: (int) ($filters['per_page'] ?? 12),
            page: (int) ($filters['page'] ?? 1),
        );
    }

    public function findPublicBySlug(string $slug): Post
    {
        return Post::query()
            ->published()
            ->with(['category', 'author', 'tags'])
            ->where('slug', $slug)
            ->firstOrFail();
    }

    public function findForPreview(string $uuid, string $token): Post
    {
        PreviewToken::validate('post', $uuid, $token);

        return Post::query()
            ->with(['category', 'author', 'tags'])
            ->where('uuid', $uuid)
            ->firstOrFail();
    }

    public function generatePreviewToken(Post $post): string
    {
        return PreviewToken::generate($post, 'post');
    }

    public function getRelatedPosts(Post $post, int $limit = 3): mixed
    {
        return Post::query()
            ->published()
            ->with(['category', 'author'])
            ->where('uuid', '!=', $post->uuid)
            ->when(
                $post->post_category_id,
                fn ($q) => $q->where('post_category_id', $post->post_category_id)
            )
            ->latest('published_at')
            ->limit($limit)
            ->get();
    }

    public function getAdjacentPosts(Post $post): array
    {
        $publishedAt = $post->published_at ?? now();

        return [
            'previous' => Post::query()
                ->published()
                ->with(['category', 'author'])
                ->where('published_at', '<', $publishedAt)
                ->orderByDesc('published_at')
                ->first(),
            'next' => Post::query()
                ->published()
                ->with(['category', 'author'])
                ->where('published_at', '>', $publishedAt)
                ->orderBy('published_at')
                ->first(),
        ];
    }

    public function create(array $data): Post
    {
        if (empty($data['slug']) && ! empty($data['title'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        if (($data['status'] ?? null) === 'published' && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        $tagUuids = $data['tag_uuids'] ?? null;
        unset($data['tag_uuids']);

        if (array_key_exists('content', $data)) {
            $data['content'] = $this->htmlSanitizer->sanitize($data['content']);
        }

        $post = parent::create($data);
        $this->syncTags($post, $tagUuids);

        return $post->load(['category', 'author', 'tags']);
    }

    public function update(\Illuminate\Database\Eloquent\Model $record, array $data): \Illuminate\Database\Eloquent\Model
    {
        if (empty($data['slug']) && ! empty($data['title'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        if (($data['status'] ?? $record->status) === 'published' && empty($data['published_at']) && ! $record->published_at) {
            $data['published_at'] = now();
        }

        $tagUuids = $data['tag_uuids'] ?? null;
        unset($data['tag_uuids']);

        if (array_key_exists('content', $data)) {
            $data['content'] = $this->htmlSanitizer->sanitize($data['content']);
        }

        $post = parent::update($record, $data);
        $this->syncTags($post, $tagUuids);

        return $post->load(['category', 'author', 'tags']);
    }

    public function bulk(array $uuids, string $action): int
    {
        $posts = $this->scopedQuery()->whereIn('uuid', $uuids)->get();
        $count = 0;

        foreach ($posts as $post) {
            match ($action) {
                'delete' => $this->delete($post),
                'publish' => $this->update($post, [
                    'status' => 'published',
                    'published_at' => $post->published_at ?? now(),
                ]),
                'archive' => $this->update($post, ['status' => 'archived']),
                'draft' => $this->update($post, ['status' => 'draft']),
            };
            $count++;
        }

        return $count;
    }

    protected function syncTags(Post $post, ?array $tagUuids): void
    {
        if ($tagUuids === null) {
            return;
        }

        $tagIds = \App\Models\Tag::query()->whereIn('uuid', $tagUuids)->pluck('id');
        $post->tags()->sync($tagIds);
    }

    protected function searchableColumns(): array
    {
        return ['title', 'slug', 'excerpt'];
    }
}
