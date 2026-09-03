<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectResource;
use App\Http\Responses\ApiResponse;
use App\Http\Responses\PaginatedResponse;
use App\Services\ProjectService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function __construct(protected ProjectService $projectService) {}

    public function index(Request $request): JsonResponse
    {
        $projects = $this->projectService->getPublicProjects(
            $request->only(['category', 'featured', 'per_page', 'page'])
        );

        return ApiResponse::success(PaginatedResponse::format($projects, ProjectResource::class));
    }

    public function show(string $slug): JsonResponse
    {
        $project = $this->projectService->findPublicBySlug($slug);
        $related = $this->projectService->getRelatedProjects($project);

        return ApiResponse::success([
            ...ProjectResource::make($project)->resolve(),
            'related' => ProjectResource::collection($related)->resolve(),
        ]);
    }

    public function preview(string $uuid): JsonResponse
    {
        $token = request()->query('token', '');
        $project = $this->projectService->findForPreview($uuid, $token);

        return ApiResponse::success(ProjectResource::make($project));
    }
}
