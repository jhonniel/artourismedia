<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>New consultation request</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.5; color: #0B2447;">
    <h2 style="margin: 0 0 1rem;">New Schedule a Consultation request</h2>

    <p style="margin: 0 0 1rem;">
        <strong>{{ $submission->name }}</strong>
        &lt;{{ $submission->email }}&gt;
        submitted a consultation request.
    </p>

    <table cellpadding="0" cellspacing="0" style="width: 100%; max-width: 560px; border-collapse: collapse;">
        @if($submission->company)
            <tr>
                <td style="padding: 0.35rem 0; font-weight: bold; width: 120px;">Company</td>
                <td style="padding: 0.35rem 0;">{{ $submission->company }}</td>
            </tr>
        @endif
        @if($submission->phone)
            <tr>
                <td style="padding: 0.35rem 0; font-weight: bold;">Phone</td>
                <td style="padding: 0.35rem 0;">{{ $submission->phone }}</td>
            </tr>
        @endif
        @if($submission->subject)
            <tr>
                <td style="padding: 0.35rem 0; font-weight: bold;">Subject</td>
                <td style="padding: 0.35rem 0;">{{ $submission->subject }}</td>
            </tr>
        @endif
    </table>

    <p style="margin: 1rem 0 0.35rem; font-weight: bold;">Message</p>
    <div style="padding: 1rem; background: #f8f4ec; border-radius: 8px; white-space: pre-wrap;">{{ $submission->message }}</div>

    <p style="margin: 1.25rem 0 0; font-size: 12px; color: #64748b;">
        View this request in the admin panel under Communication → Consultations.
    </p>
</body>
</html>
