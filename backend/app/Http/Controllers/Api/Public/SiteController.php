<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\SiteResource;
use App\Http\Responses\ApiResponse;
use App\Services\CacheService;
use App\Services\SiteService;
use Illuminate\Http\JsonResponse;

class SiteController extends Controller
{
    public function __construct(
        protected SiteService $siteService,
        protected CacheService $cacheService,
    ) {}

    public function show(): JsonResponse
    {
        $data = $this->cacheService->rememberPublicApi('api.site', 300, fn () => (new SiteResource(
            $this->siteService->getPublicSiteData()
        ))->resolve());

        return ApiResponse::success($data);
    }
}
