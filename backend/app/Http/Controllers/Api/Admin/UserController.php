<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Http\Responses\ApiResponse;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;

class UserController
{
    public function __construct(protected UserService $userService) {}

    public function index(): JsonResponse
    {
        return ApiResponse::success(UserResource::collection($this->userService->list()));
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $user = $this->userService->create($request->validated());

        return ApiResponse::success(UserResource::make($user), 'User created', 201);
    }

    public function show(string $uuid): JsonResponse
    {
        return ApiResponse::success(UserResource::make($this->userService->findByUuid($uuid)));
    }

    public function update(UpdateUserRequest $request, string $uuid): JsonResponse
    {
        $user = $this->userService->findByUuid($uuid);
        $user = $this->userService->update($user, $request->validated());

        return ApiResponse::success(UserResource::make($user), 'User updated');
    }

    public function destroy(string $uuid): JsonResponse
    {
        $this->userService->delete($this->userService->findByUuid($uuid));

        return ApiResponse::success(null, 'User deleted');
    }
}
