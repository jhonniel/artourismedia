<?php

namespace App\Http\Resources;

use App\Support\Assets;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;

class ServiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $videos = $this->resolvedVideos($request);

        return [
            'uuid' => $this->uuid,
            'slug' => $this->slug,
            'title' => $this->title,
            'description' => $this->description,
            'content' => $this->when(
                $request->route('slug') || $request->is('api/admin/*'),
                fn () => $request->is('api/admin/*')
                    ? $this->content
                    : Assets::rewriteContentHtml($this->content)
            ),
            'icon' => $this->icon,
            'image_url' => $request->is('api/admin/*')
                ? $this->image_url
                : Assets::imageUrl($this->image_url),
            'cta_text' => $this->cta_text,
            'cta_url' => $this->cta_url,
            'category' => $this->category,
            'videos' => $this->when(
                $videos !== null,
                fn () => ServiceVideoResource::collection($videos)
            ),
            'featured_videos' => $this->when(
                $this->slug === 'mindanao-connect' && $videos !== null,
                fn () => ServiceVideoResource::collection(
                    $videos->sortByDesc('view_count')->take(1)->values()
                )
            ),
            'is_active' => $this->when($request->is('api/admin/*'), $this->is_active),
            'sort_order' => $this->when($request->is('api/admin/*'), $this->sort_order),
        ];
    }

    protected function resolvedVideos(Request $request): ?Collection
    {
        if ($this->relationLoaded('videos')) {
            return $this->videos;
        }

        $isDetailRequest = $request->route('slug') === $this->slug
            || $request->is('api/admin/*');

        if ($this->slug === 'mindanao-connect' && $isDetailRequest) {
            return $this->videos()
                ->where('is_active', true)
                ->orderByDesc('published_at')
                ->orderBy('sort_order')
                ->get();
        }

        return null;
    }
}

