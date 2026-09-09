<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Requests\Admin\StoreServiceVideoRequest;
use App\Http\Requests\Admin\UpdateServiceVideoRequest;
use App\Http\Resources\ServiceVideoResource;
use App\Http\Responses\ApiResponse;
use App\Services\CrudService;
use App\Services\MindanaoConnectVideoImportService;
use App\Services\ServiceVideoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ServiceVideoController extends AdminCrudController
{
    public function __construct(
        protected ServiceVideoService $serviceVideoService,
        protected MindanaoConnectVideoImportService $importService,
    ) {}

    protected function service(): CrudService
    {
        return $this->serviceVideoService;
    }

    protected function resourceClass(): string
    {
        return ServiceVideoResource::class;
    }

    protected function returnsAllRecords(): bool
    {
        return true;
    }

    public function index(Request $request): JsonResponse
    {
        $service = $this->serviceVideoService->mindanaoConnectService();

        return ApiResponse::success(
            ServiceVideoResource::collection(
                $this->serviceVideoService->forService($service->id)
            )
        );
    }

    public function store(StoreServiceVideoRequest $request): JsonResponse
    {
        $item = $this->serviceVideoService->createForMindanaoConnect($request->validated());

        return ApiResponse::success(ServiceVideoResource::make($item), 'Video added successfully', 201);
    }

    public function update(UpdateServiceVideoRequest $request, string $uuid): JsonResponse
    {
        $item = $this->serviceVideoService->findByUuid($uuid);
        $item = $this->serviceVideoService->updateVideo($item, $request->validated());

        return ApiResponse::success(ServiceVideoResource::make($item), 'Video updated successfully');
    }

    public function importFromChannel(): JsonResponse
    {
        $result = $this->importService->importFromChannel();

        return ApiResponse::success([
            'imported' => $result['imported'],
            'updated' => $result['updated'],
            'total' => $result['total'],
        ], "Imported {$result['total']} videos from YouTube channel.");
    }
}
