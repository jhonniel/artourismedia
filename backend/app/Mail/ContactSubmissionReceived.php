<?php

namespace App\Mail;

use App\Models\ContactSubmission;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactSubmissionReceived extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public ContactSubmission $submission) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New contact submission: '.($this->submission->subject ?: $this->submission->name),
        );
    }

    public function content(): Content
    {
        return new Content(
            htmlString: '<p><strong>'.$this->submission->name.'</strong> ('.$this->submission->email.') submitted a message.</p>'
                .'<p>'.nl2br(e($this->submission->message)).'</p>',
        );
    }
}
