<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StatisticResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'number' => $this->number,
            'prefix' => $this->prefix,
            'suffix' => $this->suffix,
            'title' => $this->title,
            'description' => $this->description,
            'icon' => $this->icon,
            'is_active' => $this->when($request->is('api/admin/*'), $this->is_active),
            'sort_order' => $this->when($request->is('api/admin/*'), $this->sort_order),
        ];
    }
}
