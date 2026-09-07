<?php

namespace App\Services;

use App\Mail\ContactSubmissionConfirmation;
use App\Mail\ContactSubmissionReceived;
use App\Models\ContactSubmission;
use App\Models\SiteSetting;
use Illuminate\Support\Facades\Mail;

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

        $adminEmail = $this->adminNotificationEmail();
        if ($adminEmail) {
            Mail::to($adminEmail)->send(new ContactSubmissionReceived($submission));
        }

        Mail::to($submission->email)->send(new ContactSubmissionConfirmation($submission));

        return $submission;
    }

    protected function adminNotificationEmail(): ?string
    {
        $fromSettings = SiteSetting::query()
            ->whereIn('key', ['contact_email', 'footer_email'])
            ->pluck('value', 'key');

        return $fromSettings->get('contact_email')
            ?: $fromSettings->get('footer_email')
            ?: config('mail.from.address');
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
