<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SeoSettingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'page_key' => $this->page_key,
            'title' => $this->title,
            'description' => $this->description,
            'keywords' => $this->keywords,
            'og_image_url' => $this->og_image_url,
            'canonical_url' => $this->canonical_url,
        ];
    }
}
