<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectCategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'name' => $this->name,
            'slug' => $this->slug,
            'color' => $this->color,
            'is_active' => $this->when($request->is('api/admin/*'), $this->is_active),
            'sort_order' => $this->when($request->is('api/admin/*'), $this->sort_order),
        ];
    }
}
