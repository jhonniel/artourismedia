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

    public static function rewriteContentHtml(?string $html): ?string
    {
        if ($html === null || $html === '') {
            return $html;
        }

        if (config('assets.base_url') === '') {
            return $html;
        }

        $html = preg_replace_callback(
            '/(\s(?:src|href)=["\'])(\/images\/[^"\']+)(["\'])/i',
            fn (array $matches): string => $matches[1].self::url($matches[2]).$matches[3],
            $html
        );

        return preg_replace_callback(
            '/url\(\s*(["\']?)(\/images\/[^"\')]+)\1\s*\)/i',
            fn (array $matches): string => 'url('.$matches[1].self::url($matches[2]).$matches[1].')',
            $html
        ) ?? $html;
    }
}
