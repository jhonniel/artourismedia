<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Requests\Admin\StoreSeoSettingRequest;
use App\Http\Requests\Admin\UpdateSeoSettingRequest;
use App\Http\Resources\SeoSettingResource;
use App\Http\Responses\ApiResponse;
use App\Services\CrudService;
use App\Services\SeoSettingService;
use Illuminate\Http\JsonResponse;

class SeoSettingController extends AdminCrudController
{
    public function __construct(protected SeoSettingService $seoSettingService) {}

    protected function service(): CrudService
    {
        return $this->seoSettingService;
    }

    protected function resourceClass(): string
    {
        return SeoSettingResource::class;
    }

    public function store(StoreSeoSettingRequest $request): JsonResponse
    {
        $item = $this->seoSettingService->create($request->validated());

        return ApiResponse::success(SeoSettingResource::make($item), 'Created successfully', 201);
    }

    public function update(UpdateSeoSettingRequest $request, string $uuid): JsonResponse
    {
        $item = $this->seoSettingService->findByUuid($uuid);
        $item = $this->seoSettingService->update($item, $request->validated());

        return ApiResponse::success(SeoSettingResource::make($item), 'Updated successfully');
    }
}
