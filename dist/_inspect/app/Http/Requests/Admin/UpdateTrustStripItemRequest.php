<?php

namespace App\Http\Requests\Admin;

class UpdateTrustStripItemRequest extends StoreTrustStripItemRequest
{
    public function rules(): array
    {
        return array_merge(parent::rules(), [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
        ]);
    }
}
