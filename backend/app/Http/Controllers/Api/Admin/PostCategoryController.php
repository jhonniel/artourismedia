<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Requests\Admin\StorePostCategoryRequest;
use App\Http\Requests\Admin\UpdatePostCategoryRequest;
use App\Http\Resources\PostCategoryResource;
use App\Http\Responses\ApiResponse;
use App\Services\CrudService;
use App\Services\PostCategoryService;
use Illuminate\Http\JsonResponse;

class PostCategoryController extends AdminCrudController
{
    public function __construct(protected PostCategoryService $postCategoryService) {}

    protected function service(): CrudService
    {
        return $this->postCategoryService;
    }

    protected function resourceClass(): string
    {
        return PostCategoryResource::class;
    }

    protected function returnsAllRecords(): bool
    {
        return true;
    }

    public function store(StorePostCategoryRequest $request): JsonResponse
    {
        $item = $this->postCategoryService->create($request->validated());

        return ApiResponse::success(PostCategoryResource::make($item), 'Created successfully', 201);
    }

    public function update(UpdatePostCategoryRequest $request, string $uuid): JsonResponse
    {
        $item = $this->postCategoryService->findByUuid($uuid);
        $item = $this->postCategoryService->update($item, $request->validated());

        return ApiResponse::success(PostCategoryResource::make($item), 'Updated successfully');
    }
}
