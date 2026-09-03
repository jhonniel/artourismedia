<?php

namespace App\Mail;

use App\Models\ContactSubmission;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactSubmissionConfirmation extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public ContactSubmission $submission) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'We received your message',
        );
    }

    public function content(): Content
    {
        return new Content(
            htmlString: '<p>Hi '.$this->submission->name.',</p>'
                .'<p>Thank you for contacting Destination Studio. We have received your message and will respond shortly.</p>',
        );
    }
}
