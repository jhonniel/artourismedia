<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NavigationItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'label' => $this->label,
            'url' => $this->url,
            'target' => $this->target,
            'is_active' => $this->is_active,
            'is_cta' => $this->is_cta,
            'sort_order' => $this->sort_order,
        ];
    }
}
