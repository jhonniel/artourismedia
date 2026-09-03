<?php

namespace App\Http\Requests\Admin;

class UpdateStatisticRequest extends StoreStatisticRequest
{
    public function rules(): array
    {
        return array_merge(parent::rules(), [
            'number' => ['sometimes', 'required', 'string', 'max:50'],
            'title' => ['sometimes', 'required', 'string', 'max:255'],
        ]);
    }
}
