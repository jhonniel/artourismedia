<?php

namespace App\Services;

use App\Models\Page;
use Illuminate\Support\Str;

class PageService extends CrudService
{
    public function __construct(
        ActivityLogService $activityLog,
        protected HtmlSanitizer $htmlSanitizer,
    ) {
        parent::__construct(new Page, $activityLog, 'page');
    }

    protected function shouldFlushPublicCache(): bool
    {
        return true;
    }

    public function findPublicBySlug(string $slug): Page
    {
        return Page::query()
            ->where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();
    }

    public function create(array $data): Page
    {
        if (empty($data['slug']) && ! empty($data['title'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        if (array_key_exists('content', $data)) {
            $data['content'] = $this->htmlSanitizer->sanitize($data['content']);
        }

        return parent::create($data);
    }

    public function update(\Illuminate\Database\Eloquent\Model $record, array $data): \Illuminate\Database\Eloquent\Model
    {
        if (empty($data['slug']) && ! empty($data['title'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        if (array_key_exists('content', $data)) {
            $data['content'] = $this->htmlSanitizer->sanitize($data['content']);
        }

        return parent::update($record, $data);
    }

    protected function searchableColumns(): array
    {
        return ['title', 'slug'];
    }
}
