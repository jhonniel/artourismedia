<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\ContactRequest;
use App\Http\Resources\ContactSubmissionResource;
use App\Http\Responses\ApiResponse;
use App\Services\ContactSubmissionService;
use Illuminate\Http\JsonResponse;

class ContactController extends Controller
{
    public function __construct(protected ContactSubmissionService $contactSubmissionService) {}

    public function store(ContactRequest $request): JsonResponse
    {
        $submission = $this->contactSubmissionService->submit($request->validated());

        return ApiResponse::success(
            ContactSubmissionResource::make($submission),
            'Thank you for your consultation request. We will get back to you soon.',
            201
        );
    }
}
