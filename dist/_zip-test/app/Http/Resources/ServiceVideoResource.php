<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceVideoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'youtube_url' => $this->youtube_url,
            'youtube_id' => $this->youtube_id,
            'thumbnail_url' => $this->thumbnail_url,
            'title' => $this->title,
            'description' => $this->description,
            'view_count' => $this->view_count,
            'is_active' => $this->when($request->is('api/admin/*'), $this->is_active),
            'sort_order' => $this->when($request->is('api/admin/*'), $this->sort_order),
            'created_at' => $this->when($request->is('api/admin/*'), $this->created_at?->toIso8601String()),
        ];
    }
}
