<?php

namespace App\Services;

use App\Models\Project;
use App\Support\PreviewToken;
use Illuminate\Support\Str;

class ProjectService extends CrudService
{
    public function __construct(ActivityLogService $activityLog)
    {
        parent::__construct(new Project, $activityLog, 'project');
    }

    protected function shouldFlushPublicCache(): bool
    {
        return true;
    }

    public function paginate(int $perPage = 15, array $filters = []): mixed
    {
        return $this->applyFilters($this->query()->with('category'), $filters)
            ->orderBy('sort_order')
            ->paginate($perPage);
    }

    public function getPublicProjects(array $filters = []): mixed
    {
        $query = Project::query()
            ->with('category')
            ->where('is_published', true)
            ->orderBy('sort_order');

        if (! empty($filters['category'])) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $filters['category']));
        }

        if (! empty($filters['featured'])) {
            $query->where('is_featured', true);
        }

        return $query->paginate(
            perPage: (int) ($filters['per_page'] ?? 12),
            page: (int) ($filters['page'] ?? 1),
        );
    }

    public function findPublicBySlug(string $slug): Project
    {
        return Project::query()
            ->with('category')
            ->where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();
    }

    public function getRelatedProjects(Project $project, int $limit = 3): mixed
    {
        return Project::query()
            ->with('category')
            ->where('is_published', true)
            ->where('uuid', '!=', $project->uuid)
            ->when(
                $project->project_category_id,
                fn ($q) => $q->where('project_category_id', $project->project_category_id)
            )
            ->orderBy('sort_order')
            ->limit($limit)
            ->get();
    }

    public function create(array $data): Project
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
        return ['title', 'slug', 'excerpt'];
    }

    public function findForPreview(string $uuid, string $token): Project
    {
        PreviewToken::validate('project', $uuid, $token);

        return Project::query()
            ->with('category')
            ->where('uuid', $uuid)
            ->firstOrFail();
    }

    public function generatePreviewToken(Project $project): string
    {
        return PreviewToken::generate($project, 'project');
    }
}
