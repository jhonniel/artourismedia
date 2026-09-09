<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Consultation request received</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.5; color: #0B2447;">
    <p>Hi {{ $submission->name }},</p>

    <p>
        Thank you for requesting a consultation with Art! Boncato Tourism Consultancy.
        We have received your message and will get back to you shortly.
    </p>

    @if($submission->subject)
        <p><strong>Subject:</strong> {{ $submission->subject }}</p>
    @endif

    <p style="margin-top: 1.25rem; font-size: 12px; color: #64748b;">
        This is an automated confirmation. Please do not reply to this email unless instructed.
    </p>
</body>
</html>
