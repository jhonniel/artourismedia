<?php

namespace App\Http\Resources;

use App\Support\Assets;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HomepageSectionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $content = $this->content;

        if (! $request->is('api/admin/*')) {
            $content = Assets::transformPublicValue($content);
        }

        return [
            'uuid' => $this->uuid,
            'type' => $this->type,
            'title' => $this->title,
            'content' => $content,
            'is_active' => $this->is_active,
            'sort_order' => $this->sort_order,
        ];
    }
}
