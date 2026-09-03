<?php

namespace App\Http\Requests\Admin;

class UpdateSocialLinkRequest extends StoreSocialLinkRequest
{
    public function rules(): array
    {
        return array_merge(parent::rules(), [
            'platform' => ['sometimes', 'required', 'string', 'max:255'],
            'url' => ['sometimes', 'required', 'string', 'max:500'],
        ]);
    }
}
