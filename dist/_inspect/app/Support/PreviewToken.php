<?php

namespace App\Support;

use Illuminate\Database\Eloquent\Model;

class PreviewToken
{
    public static function generate(Model $record, string $prefix): string
    {
        $token = bin2hex(random_bytes(32));
        cache()->put(self::cacheKey($prefix, $record->uuid), $token, now()->addHours(2));

        return $token;
    }

    public static function validate(string $prefix, string $uuid, string $token): void
    {
        $stored = cache()->get(self::cacheKey($prefix, $uuid));

        if (! $stored || ! hash_equals($stored, $token)) {
            abort(403, 'Invalid or expired preview token.');
        }
    }

    public static function cacheKey(string $prefix, string $uuid): string
    {
        return "{$prefix}_preview:{$uuid}";
    }
}
