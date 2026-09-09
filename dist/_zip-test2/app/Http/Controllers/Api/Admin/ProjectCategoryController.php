<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Requests\Admin\StoreProjectCategoryRequest;
use App\Http\Requests\Admin\UpdateProjectCategoryRequest;
use App\Http\Resources\ProjectCategoryResource;
use App\Http\Responses\ApiResponse;
use App\Services\CrudService;
use App\Services\ProjectCategoryService;
use Illuminate\Http\JsonResponse;

class ProjectCategoryController extends AdminCrudController
{
    public function __construct(protected ProjectCategoryService $projectCategoryService) {}

    protected function service(): CrudService
    {
        return $this->projectCategoryService;
    }

    protected function resourceClass(): string
    {
        return ProjectCategoryResource::class;
    }

    protected function returnsAllRecords(): bool
    {
        return true;
    }

    public function store(StoreProjectCategoryRequest $request): JsonResponse
    {
        $item = $this->projectCategoryService->create($request->validated());

        return ApiResponse::success(ProjectCategoryResource::make($item), 'Created successfully', 201);
    }

    public function update(UpdateProjectCategoryRequest $request, string $uuid): JsonResponse
    {
        $item = $this->projectCategoryService->findByUuid($uuid);
        $item = $this->projectCategoryService->update($item, $request->validated());

        return ApiResponse::success(ProjectCategoryResource::make($item), 'Updated successfully');
    }
}
