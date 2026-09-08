<?php

namespace App\Http\Requests\Admin;

class UpdateServiceVideoRequest extends StoreServiceVideoRequest
{
    public function rules(): array
    {
        return array_merge(parent::rules(), [
            'youtube_url' => ['sometimes', 'required', 'string', 'max:500'],
            'title' => ['sometimes', 'required', 'string', 'max:255'],
        ]);
    }
}
