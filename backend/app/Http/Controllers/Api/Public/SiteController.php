<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\SiteResource;
use App\Http\Responses\ApiResponse;
use App\Services\SiteService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class SiteController extends Controller
{
    public function __construct(protected SiteService $siteService) {}

    public function show(): JsonResponse
    {
        $data = Cache::remember('api.site', 300, fn () => new SiteResource($this->siteService->getPublicSiteData()));

        return ApiResponse::success($data);
    }
}
