<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Services\CacheService;
use Illuminate\Http\JsonResponse;

class CacheController extends Controller
{
    public function __construct(protected CacheService $cacheService) {}

    public function flush(): JsonResponse
    {
        $this->cacheService->flushPublic();

        return ApiResponse::success(null, 'Public cache cleared');
    }
}
