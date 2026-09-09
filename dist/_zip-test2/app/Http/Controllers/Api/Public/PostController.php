<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\PostResource;
use App\Http\Responses\ApiResponse;
use App\Http\Responses\PaginatedResponse;
use App\Services\PostService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function __construct(protected PostService $postService) {}

    public function index(Request $request): JsonResponse
    {
        $posts = $this->postService->getPublicPosts(
            $request->only(['category', 'tag', 'featured', 'search', 'per_page', 'page'])
        );

        return ApiResponse::success(PaginatedResponse::format($posts, PostResource::class));
    }

    public function show(string $slug): JsonResponse
    {
        $post = $this->postService->findPublicBySlug($slug);
        $related = $this->postService->getRelatedPosts($post);
        $adjacent = $this->postService->getAdjacentPosts($post);

        return ApiResponse::success([
            ...PostResource::make($post)->resolve(),
            'related' => PostResource::collection($related)->resolve(),
            'previous' => $adjacent['previous'] ? PostResource::make($adjacent['previous'])->resolve() : null,
            'next' => $adjacent['next'] ? PostResource::make($adjacent['next'])->resolve() : null,
        ]);
    }

    public function preview(string $uuid): JsonResponse
    {
        $token = request()->query('token', '');
        $post = $this->postService->findForPreview($uuid, $token);

        return ApiResponse::success(PostResource::make($post));
    }
}
