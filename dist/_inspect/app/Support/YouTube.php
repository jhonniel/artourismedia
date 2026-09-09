<?php

namespace App\Support;

class YouTube
{
    public static function extractId(string $url): ?string
    {
        if (preg_match(
            '/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/',
            $url,
            $matches
        )) {
            return $matches[1];
        }

        return null;
    }

    public static function thumbnail(string $id, string $quality = 'hqdefault'): string
    {
        return "https://img.youtube.com/vi/{$id}/{$quality}.jpg";
    }

    public static function watchUrl(string $id): string
    {
        return "https://www.youtube.com/watch?v={$id}";
    }
}
