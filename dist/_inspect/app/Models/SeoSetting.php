<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class SeoSetting extends Model
{
    use HasUuid;

    protected $fillable = [
        'page_key',
        'title',
        'description',
        'keywords',
        'og_image_url',
        'canonical_url',
    ];

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }
}
