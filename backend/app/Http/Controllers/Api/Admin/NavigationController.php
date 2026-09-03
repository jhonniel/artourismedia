<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Requests\Admin\StoreNavigationItemRequest;
use App\Http\Requests\Admin\UpdateNavigationItemRequest;
use App\Http\Resources\NavigationItemResource;
use App\Http\Responses\ApiResponse;
use App\Services\NavigationService;
use App\Services\CrudService;
use Illuminate\Http\JsonResponse;

class NavigationController extends AdminCrudController
{
    public function __construct(protected NavigationService $navigationService) {}

    protected function service(): CrudService
    {
        return $this->navigationService;
    }

    protected function resourceClass(): string
    {
        return NavigationItemResource::class;
    }

    protected function returnsAllRecords(): bool
    {
        return true;
    }

    public function store(StoreNavigationItemRequest $request): JsonResponse
    {
        $item = $this->navigationService->create($request->validated());

        return ApiResponse::success(NavigationItemResource::make($item), 'Created successfully', 201);
    }

    public function update(UpdateNavigationItemRequest $request, string $uuid): JsonResponse
    {
        $item = $this->navigationService->findByUuid($uuid);
        $item = $this->navigationService->update($item, $request->validated());

        return ApiResponse::success(NavigationItemResource::make($item), 'Updated successfully');
    }
}
