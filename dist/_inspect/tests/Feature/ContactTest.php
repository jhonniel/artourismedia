<?php

namespace Tests\Feature;

use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ContactTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
        Mail::fake();
    }

    public function test_contact_form_submission_is_accepted(): void
    {
        config([
            'mail.default' => 'resend',
            'services.resend.key' => 're_test_key',
        ]);

        $response = $this->postJson('/api/contact', [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'message' => 'Hello from the test suite.',
        ]);

        $response->assertCreated()
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('contact_submissions', [
            'email' => 'jane@example.com',
            'status' => 'new',
            'subject' => 'Schedule a Consultation',
        ]);

        Mail::assertSent(\App\Mail\ContactSubmissionReceived::class, function ($mail) {
            return $mail->hasTo('atm@artourismedia.com');
        });
        Mail::assertSent(\App\Mail\ContactSubmissionConfirmation::class, function ($mail) {
            return $mail->hasTo('jane@example.com');
        });
    }

    public function test_contact_form_is_stored_when_mail_is_not_configured(): void
    {
        config(['mail.default' => 'log']);

        $response = $this->postJson('/api/contact', [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'message' => 'Hello without mail configured.',
        ]);

        $response->assertCreated()
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('contact_submissions', [
            'email' => 'jane@example.com',
            'message' => 'Hello without mail configured.',
        ]);

        Mail::assertNothingSent();
    }
}
