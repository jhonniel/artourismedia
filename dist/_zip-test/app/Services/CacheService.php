<?php

namespace App\Services;

class CacheService
{
    public function flushPublic(): void
    {
        cache()->forget('api.site');
        cache()->forget('api.homepage');
        cache()->forget('sitemap.urls');
    }
}
