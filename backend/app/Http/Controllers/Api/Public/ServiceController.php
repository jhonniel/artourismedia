<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceResource;
use App\Http\Responses\ApiResponse;
use App\Services\ServiceService;
use Illuminate\Http\JsonResponse;

class ServiceController extends Controller
{
    public function __construct(protected ServiceService $serviceService) {}

    public function index(): JsonResponse
    {
        return ApiResponse::success(ServiceResource::collection($this->serviceService->getPublicServices()));
    }

    public function show(string $slug): JsonResponse
    {
        return ApiResponse::success(ServiceResource::make($this->serviceService->findPublicBySlug($slug)));
    }

    public function preview(string $uuid): JsonResponse
    {
        $token = request()->query('token', '');
        $service = $this->serviceService->findForPreview($uuid, $token);

        return ApiResponse::success(ServiceResource::make($service));
    }
}
