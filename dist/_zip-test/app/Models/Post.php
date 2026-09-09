<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    use HasUuid, SoftDeletes;

    protected $fillable = [
        'post_category_id',
        'author_id',
        'slug',
        'title',
        'excerpt',
        'content',
        'featured_image_url',
        'thumbnail_url',
        'status',
        'is_featured',
        'reading_time',
        'published_at',
        'seo_title',
        'seo_description',
        'seo_keywords',
        'allow_social_sharing',
    ];

    protected function casts(): array
    {
        return [
            'is_featured' => 'boolean',
            'allow_social_sharing' => 'boolean',
            'reading_time' => 'integer',
            'published_at' => 'datetime',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(PostCategory::class, 'post_category_id');
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
