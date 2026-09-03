<?php

namespace App\Support;

class Assets
{
    public static function url(string $path): string
    {
        $path = '/'.ltrim($path, '/');
        $base = config('assets.base_url');

        if ($base === '') {
            return $path;
        }

        return $base.$path;
    }
}
