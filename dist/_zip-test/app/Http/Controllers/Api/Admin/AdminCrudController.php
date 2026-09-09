<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReorderRequest;
use App\Http\Responses\ApiResponse;
use App\Http\Responses\PaginatedResponse;
use App\Services\CrudService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

abstract class AdminCrudController extends Controller
{
    abstract protected function service(): CrudService;

    abstract protected function resourceClass(): string;

    protected function returnsAllRecords(): bool
    {
        return false;
    }

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['search', 'is_active', 'status', 'is_published', 'page']);

        if ($this->returnsAllRecords()) {
            return ApiResponse::success(
                $this->resourceClass()::collection($this->service()->all($filters))
            );
        }

        $items = $this->service()->paginate(
            $request->integer('per_page', 15),
            $filters
        );

        return ApiResponse::success(
            PaginatedResponse::format($items, $this->resourceClass())
        );
    }

    public function show(string $uuid): JsonResponse
    {
        $item = $this->service()->findByUuid($uuid);

        return ApiResponse::success($this->resourceClass()::make($item));
    }

    public function destroy(string $uuid): JsonResponse
    {
        $item = $this->service()->findByUuid($uuid);
        $this->service()->delete($item);

        return ApiResponse::success(null, 'Deleted successfully');
    }

    public function reorder(ReorderRequest $request): JsonResponse
    {
        $this->service()->reorder($request->validated('ordered_uuids'));

        return ApiResponse::success(null, 'Reordered successfully');
    }
}
