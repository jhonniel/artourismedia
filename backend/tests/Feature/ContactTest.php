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

        Mail::assertSent(\App\Mail\ContactSubmissionReceived::class);
        Mail::assertSent(\App\Mail\ContactSubmissionConfirmation::class);
    }
}
