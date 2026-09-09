<?php

namespace App\Mail;

use App\Models\NewsletterSubscriber;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewsletterWelcome extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public NewsletterSubscriber $subscriber) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Welcome to Destination Studio insights',
        );
    }

    public function content(): Content
    {
        $frontendUrl = rtrim(config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:5173')), '/');
        $unsubscribeUrl = "{$frontendUrl}/newsletter/unsubscribe?email="
            .urlencode($this->subscriber->email)
            .'&token='.$this->subscriber->unsubscribe_token;

        return new Content(
            htmlString: '<p>Thanks for subscribing to Destination Studio insights.</p>'
                .'<p>You will receive destination strategy updates in your inbox.</p>'
                .'<p><a href="'.$unsubscribeUrl.'">Unsubscribe</a></p>',
        );
    }
}
