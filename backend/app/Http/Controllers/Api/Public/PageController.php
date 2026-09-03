<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\PageResource;
use App\Http\Responses\ApiResponse;
use App\Services\PageService;
use Illuminate\Http\JsonResponse;

class PageController extends Controller
{
    public function __construct(protected PageService $pageService) {}

    public function show(string $slug): JsonResponse
    {
        return ApiResponse::success(PageResource::make($this->pageService->findPublicBySlug($slug)));
    }
}
