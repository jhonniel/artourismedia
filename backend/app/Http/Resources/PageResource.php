<?php

namespace App\Http\Resources;

use App\Support\Assets;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'slug' => $this->slug,
            'title' => $this->title,
            'content' => $request->is('api/admin/*')
                ? $this->content
                : Assets::rewriteContentHtml($this->content),
            'metadata' => $this->metadata === null
                ? null
                : $this->transformPageMetadata($request),
            'is_published' => $this->when($request->is('api/admin/*'), $this->is_published),
            'seo_title' => $this->seo_title,
            'seo_description' => $this->seo_description,
        ];
    }

    protected function transformPageMetadata(Request $request): array
    {
        $metadata = $this->metadata;

        if ($request->is('api/admin/*') || ! is_array($metadata)) {
            return $metadata;
        }

        if (isset($metadata['career_body']) && is_string($metadata['career_body'])) {
            $metadata['career_body'] = Assets::rewriteContentHtml($metadata['career_body']);
        }

        return $metadata;
    }
}
