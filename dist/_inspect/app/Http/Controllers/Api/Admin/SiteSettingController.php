<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Requests\Admin\StoreSiteSettingRequest;
use App\Http\Resources\SiteSettingResource;
use App\Http\Responses\ApiResponse;
use App\Services\SiteService;
use Illuminate\Http\JsonResponse;

class SiteSettingController
{
    public function __construct(protected SiteService $siteService) {}

    public function index(): JsonResponse
    {
        $group = request()->query('group');

        return ApiResponse::success(SiteSettingResource::collection($this->siteService->listSettings($group)));
    }

    public function bulkUpdate(\Illuminate\Http\Request $request): JsonResponse
    {
        $validated = $request->validate([
            'settings' => ['required', 'array'],
        ]);

        $settings = $this->siteService->bulkUpdateSettings($validated['settings']);

        return ApiResponse::success(SiteSettingResource::collection($settings), 'Settings updated');
    }

    public function store(StoreSiteSettingRequest $request): JsonResponse
    {
        $setting = $this->siteService->upsertSetting($request->validated());

        return ApiResponse::success(SiteSettingResource::make($setting), 'Setting saved', 201);
    }

    public function show(string $uuid): JsonResponse
    {
        $setting = $this->siteService->listSettings()->firstWhere('uuid', $uuid);

        if (! $setting) {
            return ApiResponse::error('Setting not found.', null, 404);
        }

        return ApiResponse::success(SiteSettingResource::make($setting));
    }

    public function update(StoreSiteSettingRequest $request, string $uuid): JsonResponse
    {
        $existing = $this->siteService->listSettings()->firstWhere('uuid', $uuid);

        if (! $existing) {
            return ApiResponse::error('Setting not found.', null, 404);
        }

        $setting = $this->siteService->upsertSetting(array_merge($request->validated(), [
            'key' => $request->validated('key', $existing->key),
        ]));

        return ApiResponse::success(SiteSettingResource::make($setting), 'Setting updated');
    }

    public function destroy(string $uuid): JsonResponse
    {
        $setting = $this->siteService->listSettings()->firstWhere('uuid', $uuid);

        if (! $setting) {
            return ApiResponse::error('Setting not found.', null, 404);
        }

        $this->siteService->deleteSetting($setting);

        return ApiResponse::success(null, 'Setting deleted');
    }
}
