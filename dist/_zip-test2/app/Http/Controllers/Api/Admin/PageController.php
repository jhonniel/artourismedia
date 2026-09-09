<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Requests\Admin\StorePageRequest;
use App\Http\Requests\Admin\UpdatePageRequest;
use App\Http\Resources\PageResource;
use App\Http\Responses\ApiResponse;
use App\Services\CrudService;
use App\Services\PageService;
use Illuminate\Http\JsonResponse;

class PageController extends AdminCrudController
{
    public function __construct(protected PageService $pageService) {}

    protected function service(): CrudService
    {
        return $this->pageService;
    }

    protected function resourceClass(): string
    {
        return PageResource::class;
    }

    public function store(StorePageRequest $request): JsonResponse
    {
        $item = $this->pageService->create($request->validated());

        return ApiResponse::success(PageResource::make($item), 'Created successfully', 201);
    }

    public function update(UpdatePageRequest $request, string $uuid): JsonResponse
    {
        $item = $this->pageService->findByUuid($uuid);
        $item = $this->pageService->update($item, $request->validated());

        return ApiResponse::success(PageResource::make($item), 'Updated successfully');
    }
}
