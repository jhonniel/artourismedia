<?php

namespace App\Services;

use App\Models\PostCategory;
use Illuminate\Support\Str;

class PostCategoryService extends CrudService
{
    public function __construct(ActivityLogService $activityLog)
    {
        parent::__construct(new PostCategory, $activityLog, 'post_category');
    }

    protected function shouldFlushPublicCache(): bool
    {
        return true;
    }

    public function getPublicCategories(): mixed
    {
        return PostCategory::query()
            ->where('is_active', true)
            ->withCount(['posts' => fn ($q) => $q->published()])
            ->orderBy('sort_order')
            ->get();
    }

    public function all(array $filters = []): mixed
    {
        return $this->applyFilters($this->query(), $filters)
            ->orderBy('sort_order')
            ->get();
    }

    public function create(array $data): PostCategory
    {
        if (empty($data['slug']) && ! empty($data['name'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        return parent::create($data);
    }

    public function update(\Illuminate\Database\Eloquent\Model $record, array $data): \Illuminate\Database\Eloquent\Model
    {
        if (empty($data['slug']) && ! empty($data['name'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        return parent::update($record, $data);
    }

    protected function searchableColumns(): array
    {
        return ['name', 'slug'];
    }
}
