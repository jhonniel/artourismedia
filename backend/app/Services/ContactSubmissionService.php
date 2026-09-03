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
        ]));

        $adminEmail = SiteSetting::query()->where('key', 'contact_email')->value('value');
        if ($adminEmail) {
            Mail::to($adminEmail)->queue(new ContactSubmissionReceived($submission));
        }

        Mail::to($submission->email)->queue(new ContactSubmissionConfirmation($submission));

        return $submission;
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
