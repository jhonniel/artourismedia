<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SiteResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'settings' => $this->resource['settings'] ?? [],
            'navigation' => NavigationItemResource::collection($this->resource['navigation'] ?? [])->resolve(),
            'footer' => $this->resource['footer'] ?? [],
            'social_links' => SocialLinkResource::collection($this->resource['social_links'] ?? [])->resolve(),
        ];
    }
}
