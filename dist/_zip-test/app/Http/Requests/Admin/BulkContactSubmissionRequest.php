<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BulkContactSubmissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'uuids' => ['required', 'array', 'min:1'],
            'uuids.*' => ['uuid', Rule::exists('contact_submissions', 'uuid')],
            'action' => ['required', 'string', Rule::in(['mark_read', 'delete'])],
        ];
    }
}
