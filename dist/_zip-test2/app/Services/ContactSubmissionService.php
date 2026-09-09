<?php

namespace App\Services;

use App\Mail\ContactSubmissionConfirmation;
use App\Mail\ContactSubmissionReceived;
use App\Models\ContactSubmission;
use App\Models\SiteSetting;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class ContactSubmissionService extends CrudService
{
    public function __construct(ActivityLogService $activityLog)
    {
        parent::__construct(new ContactSubmission, $activityLog, 'contact_submission');
    }

    public function submit(array $data): ContactSubmission
    {
        $submission = ContactSubmission::create(array_merge($data, [
            'status' => 'new',
            'subject' => $data['subject'] ?? 'Schedule a Consultation',
        ]));

        if ($this->isMailConfigured()) {
            $this->sendSubmissionEmails($submission);
        }

        return $submission;
    }

    protected function sendSubmissionEmails(ContactSubmission $submission): void
    {
        try {
            $adminEmail = $this->adminNotificationEmail();
            if ($adminEmail) {
                Mail::to($adminEmail)->send(new ContactSubmissionReceived($submission));
            }

            if ($submission->email) {
                Mail::to($submission->email)->send(new ContactSubmissionConfirmation($submission));
            }
        } catch (Throwable $e) {
            Log::warning('Consultation request saved but email could not be sent.', [
                'submission_uuid' => $submission->uuid,
                'error' => $e->getMessage(),
            ]);
        }
    }

    protected function isMailConfigured(): bool
    {
        $mailer = config('mail.default');

        if (in_array($mailer, ['log', 'array'], true)) {
            return false;
        }

        if ($mailer === 'smtp') {
            $host = config('mail.mailers.smtp.host');
            $username = config('mail.mailers.smtp.username');
            $password = config('mail.mailers.smtp.password');

            return filled($host)
                && $host !== '127.0.0.1'
                && filled($username)
                && filled($password);
        }

        if ($mailer === 'resend') {
            return filled(config('services.resend.key'));
        }

        return filled($mailer);
    }

    protected function adminNotificationEmail(): ?string
    {
        $fromSettings = SiteSetting::query()
            ->whereIn('key', ['contact_email', 'footer_email'])
            ->pluck('value', 'key');

        return $fromSettings->get('contact_email')
            ?: $fromSettings->get('footer_email')
            ?: config('mail.admin_address');
    }

    public function markAsRead(ContactSubmission $submission): ContactSubmission
    {
        $submission->update([
            'status' => 'read',
            'read_at' => now(),
        ]);

        $this->activityLog?->log('contact_submission.read', $submission);

        return $submission->fresh();
    }

    public function bulk(array $uuids, string $action): int
    {
        $submissions = ContactSubmission::query()->whereIn('uuid', $uuids)->get();
        $count = 0;

        foreach ($submissions as $submission) {
            match ($action) {
                'mark_read' => $this->markAsRead($submission),
                'delete' => $this->delete($submission),
            };
            $count++;
        }

        return $count;
    }

    protected function searchableColumns(): array
    {
        return ['name', 'email', 'subject', 'company'];
    }
}
