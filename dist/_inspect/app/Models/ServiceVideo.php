<?php

namespace App\Models;

use App\Support\YouTube;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ServiceVideo extends Model
{
    use HasUuid, SoftDeletes;

    protected $fillable = [
        'service_id',
        'youtube_url',
        'youtube_id',
        'title',
        'description',
        'view_count',
        'published_at',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'sort_order' => 'integer',
            'view_count' => 'integer',
            'published_at' => 'datetime',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function getThumbnailUrlAttribute(): string
    {
        return YouTube::thumbnail($this->youtube_id);
    }
}
