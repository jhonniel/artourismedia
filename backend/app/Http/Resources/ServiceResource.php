<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'slug' => $this->slug,
            'title' => $this->title,
            'description' => $this->description,
            'content' => $this->when($request->route('slug') || $request->is('api/admin/*'), $this->content),
            'icon' => $this->icon,
            'image_url' => $this->image_url,
            'cta_text' => $this->cta_text,
            'cta_url' => $this->cta_url,
            'category' => $this->category,
            'is_active' => $this->when($request->is('api/admin/*'), $this->is_active),
            'sort_order' => $this->when($request->is('api/admin/*'), $this->sort_order),
        ];
    }
}
