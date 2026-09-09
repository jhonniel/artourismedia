<?php

namespace Tests\Feature;

use App\Mail\NewsletterWelcome;
use App\Models\NewsletterSubscriber;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class NewsletterTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
        Mail::fake();
    }

    public function test_newsletter_subscription_creates_subscriber(): void
    {
        $response = $this->postJson('/api/newsletter', [
            'email' => 'new-subscriber@test.com',
            'name' => 'New Subscriber',
        ]);

        $response->assertCreated()
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('newsletter_subscribers', [
            'email' => 'new-subscriber@test.com',
            'status' => 'subscribed',
        ]);

        Mail::assertQueued(NewsletterWelcome::class);
    }

    public function test_newsletter_resubscribe_does_not_duplicate_welcome_email(): void
    {
        NewsletterSubscriber::query()->create([
            'email' => 'returning@test.com',
            'status' => 'unsubscribed',
            'subscribed_at' => now()->subMonth(),
            'unsubscribed_at' => now()->subWeek(),
        ]);

        $this->postJson('/api/newsletter', [
            'email' => 'returning@test.com',
        ])->assertCreated();

        $this->assertDatabaseHas('newsletter_subscribers', [
            'email' => 'returning@test.com',
            'status' => 'subscribed',
        ]);

        Mail::assertQueued(NewsletterWelcome::class);
    }

    public function test_newsletter_unsubscribe_marks_subscriber_inactive(): void
    {
        $subscriber = NewsletterSubscriber::query()->create([
            'email' => 'leave@test.com',
            'status' => 'subscribed',
            'subscribed_at' => now(),
            'unsubscribe_token' => 'test-unsubscribe-token',
        ]);

        $response = $this->postJson('/api/newsletter/unsubscribe', [
            'email' => $subscriber->email,
            'token' => $subscriber->unsubscribe_token,
        ]);

        $response->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('newsletter_subscribers', [
            'email' => 'leave@test.com',
            'status' => 'unsubscribed',
        ]);
    }
}
