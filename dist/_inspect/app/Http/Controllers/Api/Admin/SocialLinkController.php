<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Requests\Admin\StoreSocialLinkRequest;
use App\Http\Requests\Admin\UpdateSocialLinkRequest;
use App\Http\Resources\SocialLinkResource;
use App\Http\Responses\ApiResponse;
use App\Services\CrudService;
use App\Services\SocialLinkService;
use Illuminate\Http\JsonResponse;

class SocialLinkController extends AdminCrudController
{
    public function __construct(protected SocialLinkService $socialLinkService) {}

    protected function service(): CrudService
    {
        return $this->socialLinkService;
    }

    protected function resourceClass(): string
    {
        return SocialLinkResource::class;
    }

    protected function returnsAllRecords(): bool
    {
        return true;
    }

    public function store(StoreSocialLinkRequest $request): JsonResponse
    {
        $item = $this->socialLinkService->create($request->validated());

        return ApiResponse::success(SocialLinkResource::make($item), 'Created successfully', 201);
    }

    public function update(UpdateSocialLinkRequest $request, string $uuid): JsonResponse
    {
        $item = $this->socialLinkService->findByUuid($uuid);
        $item = $this->socialLinkService->update($item, $request->validated());

        return ApiResponse::success(SocialLinkResource::make($item), 'Updated successfully');
    }
}
