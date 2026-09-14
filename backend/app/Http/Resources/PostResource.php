<?php

namespace App\Http\Resources;

use App\Support\Assets;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'slug' => $this->slug,
            'title' => $this->title,
            'excerpt' => $this->excerpt,
            'content' => $this->when(
                $request->route('slug') || $request->is('api/admin/*'),
                fn () => $request->is('api/admin/*')
                    ? $this->content
                    : Assets::rewriteContentHtml($this->content)
            ),
            'featured_image_url' => $this->featured_image_url,
            'thumbnail_url' => $this->thumbnail_url,
            'status' => $this->when($request->is('api/admin/*'), $this->status),
            'is_featured' => $this->is_featured,
            'reading_time' => $this->reading_time,
            'published_at' => $this->published_at?->toIso8601String(),
            'category' => PostCategoryResource::make($this->whenLoaded('category')),
            'author' => UserResource::make($this->whenLoaded('author')),
            'author_uuid' => $this->when($request->is('api/admin/*'), $this->author?->uuid),
            'tags' => TagResource::collection($this->whenLoaded('tags')),
            'seo_title' => $this->when($request->route('slug') || $request->is('api/admin/*'), $this->seo_title),
            'seo_description' => $this->when($request->route('slug') || $request->is('api/admin/*'), $this->seo_description),
            'seo_keywords' => $this->when($request->is('api/admin/*'), $this->seo_keywords),
            'allow_social_sharing' => $this->when($request->route('slug') || $request->is('api/admin/*'), $this->allow_social_sharing),
        ];
    }
}
