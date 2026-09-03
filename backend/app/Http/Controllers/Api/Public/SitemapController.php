<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Services\SitemapService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function __construct(protected SitemapService $sitemapService) {}

    public function index(): JsonResponse
    {
        return ApiResponse::success($this->sitemapService->getUrls());
    }

    public function xml(): Response
    {
        return response($this->sitemapService->toXml(), 200, [
            'Content-Type' => 'application/xml',
        ]);
    }
}
