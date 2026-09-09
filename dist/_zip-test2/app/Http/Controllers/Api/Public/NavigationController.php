<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\NavigationItemResource;
use App\Http\Responses\ApiResponse;
use App\Services\NavigationService;
use Illuminate\Http\JsonResponse;

class NavigationController extends Controller
{
    public function __construct(protected NavigationService $navigationService) {}

    public function index(): JsonResponse
    {
        return ApiResponse::success(NavigationItemResource::collection($this->navigationService->getPublicNavigation()));
    }
}
