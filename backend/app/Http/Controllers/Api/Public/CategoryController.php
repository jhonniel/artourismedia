<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\PostCategoryResource;
use App\Http\Responses\ApiResponse;
use App\Services\PostCategoryService;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    public function __construct(protected PostCategoryService $postCategoryService) {}

    public function index(): JsonResponse
    {
        return ApiResponse::success(PostCategoryResource::collection($this->postCategoryService->getPublicCategories()));
    }
}
