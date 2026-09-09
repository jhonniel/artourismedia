<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreSiteSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'key' => ['required', 'string', 'max:255'],
            'value' => ['nullable'],
            'type' => ['nullable', 'string', 'in:string,boolean,integer,json'],
            'group' => ['nullable', 'string', 'max:255'],
        ];
    }
}
