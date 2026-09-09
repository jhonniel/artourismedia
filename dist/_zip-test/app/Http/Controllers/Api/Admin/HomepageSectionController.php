<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Requests\Admin\StoreHomepageSectionRequest;
use App\Http\Requests\Admin\UpdateHomepageSectionRequest;
use App\Http\Resources\HomepageSectionResource;
use App\Http\Responses\ApiResponse;
use App\Services\CrudService;
use App\Services\HomepageSectionService;
use Illuminate\Http\JsonResponse;

class HomepageSectionController extends AdminCrudController
{
    public function __construct(protected HomepageSectionService $homepageSectionService) {}

    protected function service(): CrudService
    {
        return $this->homepageSectionService;
    }

    protected function resourceClass(): string
    {
        return HomepageSectionResource::class;
    }

    protected function returnsAllRecords(): bool
    {
        return true;
    }

    public function store(StoreHomepageSectionRequest $request): JsonResponse
    {
        $item = $this->homepageSectionService->create($request->validated());

        return ApiResponse::success(HomepageSectionResource::make($item), 'Created successfully', 201);
    }

    public function update(UpdateHomepageSectionRequest $request, string $uuid): JsonResponse
    {
        $item = $this->homepageSectionService->findByUuid($uuid);
        $item = $this->homepageSectionService->update($item, $request->validated());

        return ApiResponse::success(HomepageSectionResource::make($item), 'Updated successfully');
    }
}
