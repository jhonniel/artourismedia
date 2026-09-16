<?php

namespace App\Support;

class Assets
{
    /** @var list<string> */
    private const KNOWN_CDN_BASES = [
        'https://infosoft.sgp1.digitaloceanspaces.com/tingog/reports/static',
        'https://infosoft-playground.sgp1.digitaloceanspaces.com/tingog/reports/static',
    ];

    public static function url(string $path): string
    {
        $path = '/'.ltrim($path, '/');
        $base = config('assets.base_url');

        if ($base === '') {
            return $path;
        }

        return $base.$path;
    }

    public static function imageUrl(?string $path): ?string
    {
        if ($path === null || $path === '') {
            return $path;
        }

        return self::normalizeAssetReference($path);
    }

    /**
     * Rewrite stored relative or legacy CDN paths to the current ASSETS_BASE_URL.
     */
    public static function normalizeAssetReference(string $path): string
    {
        $path = trim($path);

        if ($path === '') {
            return $path;
        }

        $configuredBase = rtrim((string) config('assets.base_url'), '/');

        foreach (array_filter([$configuredBase, ...self::KNOWN_CDN_BASES]) as $base) {
            if ($base !== '' && str_starts_with($path, $base)) {
                $path = substr($path, strlen($base));
                break;
            }
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        if (preg_match('#^/(images|documents)/#', $path) || str_starts_with($path, '/favicon')) {
            return self::url($path);
        }

        return $path;
    }

    /**
     * @param  mixed  $value
     * @return mixed
     */
    public static function transformPublicValue(mixed $value): mixed
    {
        if (is_string($value)) {
            if (preg_match('#^/(images|documents)/#', $value) || str_starts_with($value, '/favicon')) {
                return self::normalizeAssetReference($value);
            }

            if (self::looksLikeStoredAssetUrl($value)) {
                return self::normalizeAssetReference($value);
            }

            if (str_contains($value, '/images/') || str_contains($value, '/documents/')) {
                return self::rewriteContentHtml($value) ?? $value;
            }

            return $value;
        }

        if (is_array($value)) {
            $transformed = [];

            foreach ($value as $key => $item) {
                if (is_string($item) && is_string($key) && self::isAssetFieldKey($key)) {
                    $transformed[$key] = self::normalizeAssetReference($item);
                    continue;
                }

                $transformed[$key] = self::transformPublicValue($item);
            }

            return $transformed;
        }

        return $value;
    }

    private static function isAssetFieldKey(string $key): bool
    {
        return str_ends_with($key, '_url')
            || in_array($key, ['logo', 'favicon', 'portrait', 'image', 'cover', 'thumbnail'], true);
    }

    private static function looksLikeStoredAssetUrl(string $value): bool
    {
        foreach (array_filter([rtrim((string) config('assets.base_url'), '/'), ...self::KNOWN_CDN_BASES]) as $base) {
            if ($base !== '' && str_starts_with($value, $base)) {
                return true;
            }
        }

        return false;
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
            '/(\s(?:src|href)=["\'])(\/(?:images|documents)\/[^"\']+)(["\'])/i',
            fn (array $matches): string => $matches[1].self::url($matches[2]).$matches[3],
            $html
        );

        return preg_replace_callback(
            '/url\(\s*(["\']?)(\/(?:images|documents)\/[^"\')]+)\1\s*\)/i',
            fn (array $matches): string => 'url('.$matches[1].self::url($matches[2]).$matches[1].')',
            $html
        ) ?? $html;
    }
}
