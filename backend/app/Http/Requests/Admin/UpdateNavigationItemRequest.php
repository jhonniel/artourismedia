<?php

namespace App\Http\Requests\Admin;

class UpdateNavigationItemRequest extends StoreNavigationItemRequest
{
    public function rules(): array
    {
        return array_merge(parent::rules(), [
            'label' => ['sometimes', 'required', 'string', 'max:255'],
            'url' => ['sometimes', 'required', 'string', 'max:500'],
        ]);
    }
}
