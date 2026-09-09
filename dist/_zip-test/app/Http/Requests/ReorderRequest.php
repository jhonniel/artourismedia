<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReorderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'ordered_uuids' => ['required', 'array', 'min:1'],
            'ordered_uuids.*' => ['required', 'uuid'],
        ];
    }
}
