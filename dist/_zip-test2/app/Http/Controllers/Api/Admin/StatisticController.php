<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Requests\Admin\StoreStatisticRequest;
use App\Http\Requests\Admin\UpdateStatisticRequest;
use App\Http\Resources\StatisticResource;
use App\Http\Responses\ApiResponse;
use App\Services\CrudService;
use App\Services\StatisticService;
use Illuminate\Http\JsonResponse;

class StatisticController extends AdminCrudController
{
    public function __construct(protected StatisticService $statisticService) {}

    protected function service(): CrudService
    {
        return $this->statisticService;
    }

    protected function resourceClass(): string
    {
        return StatisticResource::class;
    }

    protected function returnsAllRecords(): bool
    {
        return true;
    }

    public function store(StoreStatisticRequest $request): JsonResponse
    {
        $item = $this->statisticService->create($request->validated());

        return ApiResponse::success(StatisticResource::make($item), 'Created successfully', 201);
    }

    public function update(UpdateStatisticRequest $request, string $uuid): JsonResponse
    {
        $item = $this->statisticService->findByUuid($uuid);
        $item = $this->statisticService->update($item, $request->validated());

        return ApiResponse::success(StatisticResource::make($item), 'Updated successfully');
    }
}
