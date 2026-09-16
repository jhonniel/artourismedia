<?php

namespace App\Http\Resources;

use App\Support\Assets;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SiteResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $settings = $this->resource['settings'] ?? [];

        if (! $request->is('api/admin/*')) {
            $settings = Assets::transformPublicValue($settings);
        }

        return [
            'settings' => $settings,
            'navigation' => NavigationItemResource::collection($this->resource['navigation'] ?? [])->resolve(),
            'footer' => $this->resource['footer'] ?? [],
            'social_links' => SocialLinkResource::collection($this->resource['social_links'] ?? [])->resolve(),
        ];
    }
}
