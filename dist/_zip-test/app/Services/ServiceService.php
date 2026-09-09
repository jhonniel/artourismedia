<?php

namespace App\Services;

use App\Models\Service;
use App\Support\PreviewToken;
use Illuminate\Support\Str;

class ServiceService extends CrudService
{
    public function __construct(ActivityLogService $activityLog)
    {
        parent::__construct(new Service, $activityLog, 'service');
    }

    protected function shouldFlushPublicCache(): bool
    {
        return true;
    }

    public function getPublicServices(): mixed
    {
        return Service::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();
    }

    public function paginate(int $perPage = 15, array $filters = []): mixed
    {
        $page = (int) ($filters['page'] ?? 1);

        return $this->applyFilters($this->query(), $filters)
            ->orderBy('sort_order')
            ->paginate(perPage: $perPage, page: $page);
    }

    public function findPublicBySlug(string $slug): Service
    {
        return Service::query()
            ->where('slug', $slug)
            ->where('is_active', true)
            ->with(['videos' => fn ($query) => $query->where('is_active', true)->orderByDesc('published_at')->orderBy('sort_order')])
            ->firstOrFail();
    }

    public function create(array $data): Service
    {
        if (empty($data['slug']) && ! empty($data['title'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        return parent::create($data);
    }

    public function update(\Illuminate\Database\Eloquent\Model $record, array $data): \Illuminate\Database\Eloquent\Model
    {
        if (empty($data['slug']) && ! empty($data['title'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        return parent::update($record, $data);
    }

    protected function searchableColumns(): array
    {
        return ['title', 'slug', 'category'];
    }

    public function findForPreview(string $uuid, string $token): Service
    {
        PreviewToken::validate('service', $uuid, $token);

        return Service::query()
            ->where('uuid', $uuid)
            ->firstOrFail();
    }

    public function generatePreviewToken(Service $service): string
    {
        return PreviewToken::generate($service, 'service');
    }
}
