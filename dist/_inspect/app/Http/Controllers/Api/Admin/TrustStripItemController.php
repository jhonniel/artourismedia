<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Requests\Admin\StoreTrustStripItemRequest;
use App\Http\Requests\Admin\UpdateTrustStripItemRequest;
use App\Http\Resources\TrustStripItemResource;
use App\Http\Responses\ApiResponse;
use App\Services\CrudService;
use App\Services\TrustStripItemService;
use Illuminate\Http\JsonResponse;

class TrustStripItemController extends AdminCrudController
{
    public function __construct(protected TrustStripItemService $trustStripItemService) {}

    protected function service(): CrudService
    {
        return $this->trustStripItemService;
    }

    protected function resourceClass(): string
    {
        return TrustStripItemResource::class;
    }

    protected function returnsAllRecords(): bool
    {
        return true;
    }

    public function store(StoreTrustStripItemRequest $request): JsonResponse
    {
        $item = $this->trustStripItemService->create($request->validated());

        return ApiResponse::success(TrustStripItemResource::make($item), 'Created successfully', 201);
    }

    public function update(UpdateTrustStripItemRequest $request, string $uuid): JsonResponse
    {
        $item = $this->trustStripItemService->findByUuid($uuid);
        $item = $this->trustStripItemService->update($item, $request->validated());

        return ApiResponse::success(TrustStripItemResource::make($item), 'Updated successfully');
    }
}
