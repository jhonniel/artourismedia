<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Requests\Admin\StoreProjectRequest;
use App\Http\Requests\Admin\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Http\Responses\ApiResponse;
use App\Services\CrudService;
use App\Services\ProjectService;
use Illuminate\Http\JsonResponse;

class ProjectController extends AdminCrudController
{
    public function __construct(protected ProjectService $projectService) {}

    protected function service(): CrudService
    {
        return $this->projectService;
    }

    protected function resourceClass(): string
    {
        return ProjectResource::class;
    }

    public function show(string $uuid): JsonResponse
    {
        $item = $this->projectService->findByUuid($uuid);
        $item->load('category');

        return ApiResponse::success(ProjectResource::make($item));
    }

    public function store(StoreProjectRequest $request): JsonResponse
    {
        $item = $this->projectService->create($request->validated());

        return ApiResponse::success(ProjectResource::make($item->load('category')), 'Created successfully', 201);
    }

    public function update(UpdateProjectRequest $request, string $uuid): JsonResponse
    {
        $item = $this->projectService->findByUuid($uuid);
        $item = $this->projectService->update($item, $request->validated());

        return ApiResponse::success(ProjectResource::make($item->load('category')), 'Updated successfully');
    }

    public function previewToken(string $uuid): JsonResponse
    {
        $project = $this->projectService->findByUuid($uuid);
        $token = $this->projectService->generatePreviewToken($project);
        $frontendUrl = rtrim(config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:5173')), '/');

        return ApiResponse::success([
            'token' => $token,
            'preview_url' => "{$frontendUrl}/projects/preview/{$project->uuid}?token={$token}",
        ]);
    }
}
