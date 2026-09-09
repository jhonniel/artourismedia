<?php

namespace App\Services;

use App\Models\Tag;
use Illuminate\Support\Str;

class TagService extends CrudService
{
    public function __construct(ActivityLogService $activityLog)
    {
        parent::__construct(new Tag, $activityLog, 'tag');
    }

    protected function shouldFlushPublicCache(): bool
    {
        return true;
    }

    public function create(array $data): Tag
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
