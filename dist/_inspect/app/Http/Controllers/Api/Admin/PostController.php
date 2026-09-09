<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Requests\Admin\BulkPostRequest;
use App\Http\Requests\Admin\StorePostRequest;
use App\Http\Requests\Admin\UpdatePostRequest;
use App\Http\Resources\PostResource;
use App\Http\Responses\ApiResponse;
use App\Services\CrudService;
use App\Services\PostService;
use Illuminate\Http\JsonResponse;

class PostController extends AdminCrudController
{
    public function __construct(protected PostService $postService) {}

    protected function service(): CrudService
    {
        return $this->postService;
    }

    protected function resourceClass(): string
    {
        return PostResource::class;
    }

    public function store(StorePostRequest $request): JsonResponse
    {
        $item = $this->postService->create($request->validated());

        return ApiResponse::success(PostResource::make($item), 'Created successfully', 201);
    }

    public function show(string $uuid): JsonResponse
    {
        $item = $this->postService->findByUuid($uuid);
        $item->load(['category', 'author', 'tags']);

        return ApiResponse::success(PostResource::make($item));
    }

    public function update(UpdatePostRequest $request, string $uuid): JsonResponse
    {
        $item = $this->postService->findByUuid($uuid);
        $item = $this->postService->update($item, $request->validated());

        return ApiResponse::success(PostResource::make($item), 'Updated successfully');
    }

    public function previewToken(string $uuid): JsonResponse
    {
        $post = $this->postService->findByUuid($uuid);
        $token = $this->postService->generatePreviewToken($post);
        $frontendUrl = rtrim(config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:5173')), '/');

        return ApiResponse::success([
            'token' => $token,
            'preview_url' => "{$frontendUrl}/insights/preview/{$post->uuid}?token={$token}",
        ]);
    }

    public function bulk(BulkPostRequest $request): JsonResponse
    {
        $count = $this->postService->bulk(
            $request->validated('uuids'),
            $request->validated('action')
        );

        return ApiResponse::success(['count' => $count], "{$count} post(s) updated");
    }
}
