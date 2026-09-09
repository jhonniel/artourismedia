<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Service extends Model
{
    use HasUuid, SoftDeletes;

    protected $fillable = [
        'slug',
        'title',
        'description',
        'content',
        'icon',
        'image_url',
        'cta_text',
        'cta_url',
        'category',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function videos(): HasMany
    {
        return $this->hasMany(ServiceVideo::class)->orderByDesc('published_at')->orderBy('sort_order');
    }
}
