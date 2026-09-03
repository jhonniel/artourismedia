<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class CrudService
{
    public function __construct(
        protected Model $model,
        protected ?ActivityLogService $activityLog = null,
        protected string $logPrefix = 'resource',
        protected ?CacheService $cacheService = null,
    ) {
        $this->cacheService ??= app(CacheService::class);
    }

    public function query(): Builder
    {
        return $this->model->newQuery();
    }

    public function paginate(int $perPage = 15, array $filters = []): mixed
    {
        $page = (int) ($filters['page'] ?? 1);

        return $this->applyFilters($this->query(), $filters)
            ->latest()
            ->paginate(perPage: $perPage, page: $page);
    }

    public function all(array $filters = []): mixed
    {
        return $this->applyFilters($this->query(), $filters)->get();
    }

    public function findByUuid(string $uuid): Model
    {
        return $this->query()->where('uuid', $uuid)->firstOrFail();
    }

    public function create(array $data): Model
    {
        $record = $this->model->create($data);
        $this->log('created', $record);
        $this->flushPublicCacheIfNeeded();

        return $record->fresh();
    }

    public function update(Model $record, array $data): Model
    {
        $record->update($data);
        $this->log('updated', $record);
        $this->flushPublicCacheIfNeeded();

        return $record->fresh();
    }

    public function delete(Model $record): void
    {
        $this->log('deleted', $record);
        $record->delete();
        $this->flushPublicCacheIfNeeded();
    }

    public function reorder(array $orderedUuids): void
    {
        if (! in_array('sort_order', $this->model->getFillable(), true)) {
            return;
        }

        DB::transaction(function () use ($orderedUuids) {
            foreach ($orderedUuids as $index => $uuid) {
                $this->query()->where('uuid', $uuid)->update(['sort_order' => $index + 1]);
            }
        });

        $this->activityLog?->log("{$this->logPrefix}.reordered");
        $this->flushPublicCacheIfNeeded();
    }

    protected function flushPublicCacheIfNeeded(): void
    {
        if ($this->shouldFlushPublicCache()) {
            $this->cacheService->flushPublic();
        }
    }

    protected function shouldFlushPublicCache(): bool
    {
        return false;
    }

    protected function applyFilters(Builder $query, array $filters): Builder
    {
        if (isset($filters['search']) && $filters['search']) {
            $search = $filters['search'];
            $query->where(function (Builder $q) use ($search) {
                foreach ($this->searchableColumns() as $column) {
                    $q->orWhere($column, 'like', "%{$search}%");
                }
            });
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN));
        }

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['is_published'])) {
            $query->where('is_published', filter_var($filters['is_published'], FILTER_VALIDATE_BOOLEAN));
        }

        if (isset($filters['is_featured'])) {
            $query->where('is_featured', filter_var($filters['is_featured'], FILTER_VALIDATE_BOOLEAN));
        }

        if (! empty($filters['date_from'])) {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }

        if (! empty($filters['date_to'])) {
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }

        return $query;
    }

    protected function searchableColumns(): array
    {
        return ['title', 'name', 'email'];
    }

    protected function log(string $action, Model $record): void
    {
        $this->activityLog?->log("{$this->logPrefix}.{$action}", $record);
    }
}
