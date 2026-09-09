<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Resources\ContactSubmissionResource;
use App\Http\Resources\PostResource;
use App\Http\Resources\ProjectResource;
use App\Http\Responses\ApiResponse;
use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;

class DashboardController
{
    public function __construct(protected DashboardService $dashboardService) {}

    public function index(): JsonResponse
    {
        $data = $this->dashboardService->getDashboardData();

        return ApiResponse::success([
            'stats' => $data['stats'],
            'recent_posts' => PostResource::collection($data['recent_posts']),
            'recent_projects' => ProjectResource::collection($data['recent_projects']),
            'recent_messages' => ContactSubmissionResource::collection($data['recent_messages']),
        ]);
    }
}
