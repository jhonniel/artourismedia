<?php

namespace App\Services;

use App\Mail\NewsletterWelcome;
use App\Models\NewsletterSubscriber;
use Illuminate\Support\Facades\Mail;

class NewsletterService extends CrudService
{
    public function __construct(ActivityLogService $activityLog)
    {
        parent::__construct(new NewsletterSubscriber, $activityLog, 'newsletter_subscriber');
    }

    public function subscribe(array $data): NewsletterSubscriber
    {
        $subscriber = NewsletterSubscriber::query()->where('email', $data['email'])->first();
        $wasSubscribed = $subscriber?->status === 'subscribed';

        if ($subscriber) {
            if ($subscriber->status === 'subscribed') {
                return $subscriber;
            }

            $subscriber->update([
                'name' => $data['name'] ?? $subscriber->name,
                'status' => 'subscribed',
                'subscribed_at' => now(),
                'unsubscribed_at' => null,
            ]);

            $subscriber = $subscriber->fresh();
        } else {
            $subscriber = NewsletterSubscriber::create([
                'email' => $data['email'],
                'name' => $data['name'] ?? null,
                'status' => 'subscribed',
                'subscribed_at' => now(),
            ]);
        }

        if (! $wasSubscribed) {
            Mail::to($subscriber->email)->queue(new NewsletterWelcome($subscriber));
        }

        return $subscriber;
    }

    public function unsubscribe(string $email, ?string $token = null): bool
    {
        $query = NewsletterSubscriber::query()->where('email', $email);

        if ($token) {
            $query->where('unsubscribe_token', $token);
        }

        $subscriber = $query->first();

        if (! $subscriber) {
            return false;
        }

        $subscriber->update([
            'status' => 'unsubscribed',
            'unsubscribed_at' => now(),
        ]);

        return true;
    }

    public function unsubscribeByUuid(string $uuid): NewsletterSubscriber
    {
        $subscriber = $this->findByUuid($uuid);

        $subscriber->update([
            'status' => 'unsubscribed',
            'unsubscribed_at' => now(),
        ]);

        $this->activityLog?->log('newsletter_subscriber.unsubscribed', $subscriber);

        return $subscriber->fresh();
    }

    protected function searchableColumns(): array
    {
        return ['email', 'name'];
    }
}
