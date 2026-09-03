<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Requests\Admin\BulkContactSubmissionRequest;
use App\Http\Resources\ContactSubmissionResource;
use App\Http\Responses\ApiResponse;
use App\Services\ContactSubmissionService;
use App\Services\CrudService;
use Illuminate\Http\JsonResponse;

class ContactSubmissionController extends AdminCrudController
{
    public function __construct(protected ContactSubmissionService $contactSubmissionService) {}

    protected function service(): CrudService
    {
        return $this->contactSubmissionService;
    }

    protected function resourceClass(): string
    {
        return ContactSubmissionResource::class;
    }

    public function markAsRead(string $uuid): JsonResponse
    {
        $item = $this->contactSubmissionService->findByUuid($uuid);
        $item = $this->contactSubmissionService->markAsRead($item);

        return ApiResponse::success(ContactSubmissionResource::make($item), 'Marked as read');
    }

    public function bulk(BulkContactSubmissionRequest $request): JsonResponse
    {
        $count = $this->contactSubmissionService->bulk(
            $request->validated('uuids'),
            $request->validated('action')
        );

        return ApiResponse::success(['count' => $count], "{$count} submission(s) updated");
    }
}
