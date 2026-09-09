<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\HomepageResource;
use App\Http\Responses\ApiResponse;
use App\Services\CacheService;
use App\Services\HomepageSectionService;
use Illuminate\Http\JsonResponse;

class HomepageController extends Controller
{
    public function __construct(
        protected HomepageSectionService $homepageSectionService,
        protected CacheService $cacheService,
    ) {}

    public function index(): JsonResponse
    {
        $data = $this->cacheService->rememberPublicApi('api.homepage', 300, fn () => (new HomepageResource(
            $this->homepageSectionService->getPublicHomepageData()
        ))->resolve());

        return ApiResponse::success($data);
    }
}
