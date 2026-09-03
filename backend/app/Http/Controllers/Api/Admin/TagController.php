<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Requests\Admin\StoreTagRequest;
use App\Http\Requests\Admin\UpdateTagRequest;
use App\Http\Resources\TagResource;
use App\Http\Responses\ApiResponse;
use App\Services\CrudService;
use App\Services\TagService;
use Illuminate\Http\JsonResponse;

class TagController extends AdminCrudController
{
    public function __construct(protected TagService $tagService) {}

    protected function service(): CrudService
    {
        return $this->tagService;
    }

    protected function resourceClass(): string
    {
        return TagResource::class;
    }

    protected function returnsAllRecords(): bool
    {
        return true;
    }

    public function store(StoreTagRequest $request): JsonResponse
    {
        $item = $this->tagService->create($request->validated());

        return ApiResponse::success(TagResource::make($item), 'Created successfully', 201);
    }

    public function update(UpdateTagRequest $request, string $uuid): JsonResponse
    {
        $item = $this->tagService->findByUuid($uuid);
        $item = $this->tagService->update($item, $request->validated());

        return ApiResponse::success(TagResource::make($item), 'Updated successfully');
    }
}
