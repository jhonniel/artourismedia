<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Resources\NewsletterSubscriberResource;
use App\Http\Responses\ApiResponse;
use App\Services\CrudService;
use App\Services\NewsletterService;
use Illuminate\Http\JsonResponse;

class NewsletterSubscriberController extends AdminCrudController
{
    public function __construct(protected NewsletterService $newsletterService) {}

    protected function service(): CrudService
    {
        return $this->newsletterService;
    }

    protected function resourceClass(): string
    {
        return NewsletterSubscriberResource::class;
    }

    public function unsubscribe(string $uuid): JsonResponse
    {
        $subscriber = $this->newsletterService->unsubscribeByUuid($uuid);

        return ApiResponse::success(
            NewsletterSubscriberResource::make($subscriber),
            'Subscriber unsubscribed'
        );
    }
}
