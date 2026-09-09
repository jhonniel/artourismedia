<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\SocialLinkResource;
use App\Http\Responses\ApiResponse;
use App\Services\SocialLinkService;
use Illuminate\Http\JsonResponse;

class SocialLinkController extends Controller
{
    public function __construct(protected SocialLinkService $socialLinkService) {}

    public function index(): JsonResponse
    {
        return ApiResponse::success(SocialLinkResource::collection($this->socialLinkService->getPublicLinks()));
    }
}
