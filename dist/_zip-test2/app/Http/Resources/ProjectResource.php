<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'slug' => $this->slug,
            'title' => $this->title,
            'excerpt' => $this->excerpt,
            'content' => $this->when($request->route('slug') || $request->is('api/admin/*'), $this->content),
            'cover_image_url' => $this->cover_image_url,
            'category_label' => $this->category_label,
            'category' => ProjectCategoryResource::make($this->whenLoaded('category')),
            'cta_text' => $this->cta_text,
            'cta_url' => $this->cta_url,
            'color' => $this->color,
            'is_featured' => $this->is_featured,
            'is_published' => $this->when($request->is('api/admin/*'), $this->is_published),
            'sort_order' => $this->when($request->is('api/admin/*'), $this->sort_order),
            'seo_title' => $this->when($request->route('slug') || $request->is('api/admin/*'), $this->seo_title),
            'seo_description' => $this->when($request->route('slug') || $request->is('api/admin/*'), $this->seo_description),
        ];
    }
}
