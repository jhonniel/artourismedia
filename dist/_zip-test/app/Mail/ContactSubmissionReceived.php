<?php

namespace App\Mail;

use App\Models\ContactSubmission;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactSubmissionReceived extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public ContactSubmission $submission) {}

    public function envelope(): Envelope
    {
        $subject = $this->submission->subject ?: 'Schedule a Consultation';

        return new Envelope(
            subject: 'New consultation request: '.$subject,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mail.contact-submission-received',
        );
    }
}
