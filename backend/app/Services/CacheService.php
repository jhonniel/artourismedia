<?php

namespace App\Services;

class CacheService
{
    /**
     * Cache API payloads as plain arrays so Redis never stores Laravel resource objects.
     *
     * @template T of array<string, mixed>
     *
     * @param  callable(): T  $callback
     * @return T
     */
    public function rememberPublicApi(string $key, int $seconds, callable $callback): array
    {
        /** @var T */
        $data = cache()->remember($key, $seconds, function () use ($callback) {
            $payload = $callback();

            return json_decode(json_encode($payload), true) ?? [];
        });

        if ($this->isCorruptedPublicPayload($key, $data)) {
            cache()->forget($key);

            /** @var T */
            return cache()->remember($key, $seconds, function () use ($callback) {
                $payload = $callback();

                return json_decode(json_encode($payload), true) ?? [];
            });
        }

        return $data;
    }

    public function isCorruptedPublicPayload(string $key, mixed $data): bool
    {
        if (! is_array($data)) {
            return true;
        }

        $encoded = json_encode($data) ?: '';

        if (str_contains($encoded, '__PHP_Incomplete_Class')
            || str_contains($encoded, 'AnonymousResourceCollection')) {
            return true;
        }

        return match ($key) {
            'api.site' => ! isset($data['navigation'], $data['social_links'])
                || ! is_array($data['navigation'])
                || ! is_array($data['social_links'])
                || ! array_is_list($data['navigation'])
                || ! array_is_list($data['social_links']),
            'api.homepage' => ! isset($data['sections'], $data['services'])
                || ! is_array($data['sections'])
                || ! is_array($data['services'])
                || ! array_is_list($data['sections'])
                || ! array_is_list($data['services']),
            default => false,
        };
    }

    public function flushPublic(): void
    {
        cache()->forget('api.site');
        cache()->forget('api.homepage');
        cache()->forget('sitemap.urls');
    }
}
