<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TrustStripItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'title' => $this->title,
            'description' => $this->description,
            'icon' => $this->icon,
            'link' => $this->link,
            'is_active' => $this->is_active,
            'sort_order' => $this->sort_order,
        ];
    }
}
