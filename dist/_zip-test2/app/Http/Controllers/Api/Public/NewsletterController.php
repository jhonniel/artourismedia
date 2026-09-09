<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\NewsletterSubscribeRequest;
use App\Http\Requests\Public\NewsletterUnsubscribeRequest;
use App\Http\Resources\NewsletterSubscriberResource;
use App\Http\Responses\ApiResponse;
use App\Services\NewsletterService;
use Illuminate\Http\JsonResponse;

class NewsletterController extends Controller
{
    public function __construct(protected NewsletterService $newsletterService) {}

    public function subscribe(NewsletterSubscribeRequest $request): JsonResponse
    {
        $subscriber = $this->newsletterService->subscribe($request->validated());

        return ApiResponse::success(
            NewsletterSubscriberResource::make($subscriber),
            'Successfully subscribed to the newsletter.',
            201
        );
    }

    public function unsubscribe(NewsletterUnsubscribeRequest $request): JsonResponse
    {
        $unsubscribed = $this->newsletterService->unsubscribe(
            $request->validated('email'),
            $request->validated('token')
        );

        if (! $unsubscribed) {
            return ApiResponse::error('Subscriber not found.', null, 404);
        }

        return ApiResponse::success(null, 'Successfully unsubscribed from the newsletter.');
    }
}
