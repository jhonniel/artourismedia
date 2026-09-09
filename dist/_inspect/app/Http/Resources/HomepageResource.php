<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HomepageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'sections' => HomepageSectionResource::collection($this->resource['sections'] ?? []),
            'trust_strip_items' => TrustStripItemResource::collection($this->resource['trust_strip_items'] ?? []),
            'services' => ServiceResource::collection($this->resource['services'] ?? []),
            'featured_projects' => ProjectResource::collection($this->resource['featured_projects'] ?? []),
            'statistics' => StatisticResource::collection($this->resource['statistics'] ?? []),
            'latest_posts' => PostResource::collection($this->resource['latest_posts'] ?? []),
        ];
    }
}
