<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Requests\Admin\UpdateMediaRequest;
use App\Http\Requests\Admin\UploadMediaRequest;
use App\Http\Resources\MediaResource;
use App\Http\Responses\ApiResponse;
use App\Services\CrudService;
use App\Services\MediaService;
use Illuminate\Http\JsonResponse;
class MediaController extends AdminCrudController
{
    public function __construct(protected MediaService $mediaService) {}

    protected function service(): CrudService
    {
        return $this->mediaService;
    }

    protected function resourceClass(): string
    {
        return MediaResource::class;
    }

    public function upload(UploadMediaRequest $request): JsonResponse
    {
        $media = $this->mediaService->upload(
            $request->file('file'),
            $request->user()->id,
            $request->validated('alt_text')
        );

        return ApiResponse::success(MediaResource::make($media), 'Uploaded successfully', 201);
    }

    public function update(UpdateMediaRequest $request, string $uuid): JsonResponse
    {
        $item = $this->mediaService->findByUuid($uuid);
        $item = $this->mediaService->update($item, $request->validated());

        return ApiResponse::success(MediaResource::make($item), 'Updated successfully');
    }
}
