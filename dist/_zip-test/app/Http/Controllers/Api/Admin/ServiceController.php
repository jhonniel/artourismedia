<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Requests\Admin\StoreServiceRequest;
use App\Http\Requests\Admin\UpdateServiceRequest;
use App\Http\Resources\ServiceResource;
use App\Http\Responses\ApiResponse;
use App\Services\CrudService;
use App\Services\ServiceService;
use Illuminate\Http\JsonResponse;

class ServiceController extends AdminCrudController
{
    public function __construct(protected ServiceService $serviceService) {}

    protected function service(): CrudService
    {
        return $this->serviceService;
    }

    protected function resourceClass(): string
    {
        return ServiceResource::class;
    }

    public function store(StoreServiceRequest $request): JsonResponse
    {
        $item = $this->serviceService->create($request->validated());

        return ApiResponse::success(ServiceResource::make($item), 'Created successfully', 201);
    }

    public function update(UpdateServiceRequest $request, string $uuid): JsonResponse
    {
        $item = $this->serviceService->findByUuid($uuid);
        $item = $this->serviceService->update($item, $request->validated());

        return ApiResponse::success(ServiceResource::make($item), 'Updated successfully');
    }

    public function previewToken(string $uuid): JsonResponse
    {
        $service = $this->serviceService->findByUuid($uuid);
        $token = $this->serviceService->generatePreviewToken($service);
        $frontendUrl = rtrim(config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:5173')), '/');

        return ApiResponse::success([
            'token' => $token,
            'preview_url' => "{$frontendUrl}/services/preview/{$service->uuid}?token={$token}",
        ]);
    }
}
