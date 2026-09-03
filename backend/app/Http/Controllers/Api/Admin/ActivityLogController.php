<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ActivityLogResource;
use App\Http\Responses\ApiResponse;
use App\Http\Responses\PaginatedResponse;
use App\Models\ActivityLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $logs = ActivityLog::query()
            ->with('user')
            ->when($request->query('action'), fn ($q, $action) => $q->where('action', 'like', "%{$action}%"))
            ->latest()
            ->paginate($request->integer('per_page', 20));

        return ApiResponse::success(
            PaginatedResponse::format($logs, ActivityLogResource::class)
        );
    }
}
