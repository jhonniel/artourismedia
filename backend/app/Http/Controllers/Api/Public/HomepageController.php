<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\HomepageResource;
use App\Http\Responses\ApiResponse;
use App\Services\HomepageSectionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class HomepageController extends Controller
{
    public function __construct(protected HomepageSectionService $homepageSectionService) {}

    public function index(): JsonResponse
    {
        $data = Cache::remember('api.homepage', 300, fn () => new HomepageResource(
            $this->homepageSectionService->getPublicHomepageData()
        ));

        return ApiResponse::success($data);
    }
}
