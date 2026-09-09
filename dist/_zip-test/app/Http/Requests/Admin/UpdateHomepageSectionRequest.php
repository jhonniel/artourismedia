<?php

namespace App\Http\Requests\Admin;

class UpdateHomepageSectionRequest extends StoreHomepageSectionRequest
{
    public function rules(): array
    {
        return array_merge(parent::rules(), [
            'type' => ['sometimes', 'required', 'string', 'max:255'],
        ]);
    }
}
