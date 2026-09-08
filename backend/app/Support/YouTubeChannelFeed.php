<?php

namespace App\Support;

use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\PendingRequest;
use SimpleXMLElement;

class YouTubeChannelFeed
{
    public const MINDANAO_ROADTRIP_CHANNEL_ID = 'UCweOc-4sopqqa0N3GuOztnw';

    public const MINDANAO_ROADTRIP_HANDLE = 'mindanaoroadtripwithart9335';

    protected static function httpClient(): PendingRequest
    {
        $request = Http::timeout(40)->withHeaders([
            'User-Agent' => 'Mozilla/5.0 (compatible; ArtWebsiteBot/1.0)',
        ]);

        if (app()->environment('local', 'testing')) {
            $request = $request->withoutVerifying();
        }

        return $request;
    }

    /**
     * @return array<int, array{id: string, title: string, description: ?string, url: string, view_count: int, published_at: ?string}>
     */
    public static function fetchChannelVideos(string $channelId = self::MINDANAO_ROADTRIP_CHANNEL_ID): array
    {
        $videos = [];

        foreach (self::parseRssFeed($channelId) as $video) {
            $videos[$video['id']] = $video;
        }

        foreach (self::fetchVideoIdsFromUploadsPlaylist($channelId) as $id) {
            if (isset($videos[$id])) {
                continue;
            }

            $videos[$id] = [
                'id' => $id,
                'title' => self::fetchVideoTitle($id) ?? "Mindanao Roadtrip with Art — {$id}",
                'description' => null,
                'url' => YouTube::watchUrl($id),
                'view_count' => 0,
                'published_at' => null,
            ];
        }

        uasort($videos, fn (array $a, array $b) => strcmp($b['published_at'] ?? '', $a['published_at'] ?? ''));

        return array_values($videos);
    }

    /**
     * @return array<int, array{id: string, title: string, description: ?string, url: string, view_count: int, published_at: ?string}>
     */
    protected static function parseRssFeed(string $channelId): array
    {
        $response = self::httpClient()->get('https://www.youtube.com/feeds/videos.xml', [
            'channel_id' => $channelId,
        ]);

        if (! $response->successful()) {
            return [];
        }

        $xml = @simplexml_load_string($response->body());

        if (! $xml instanceof SimpleXMLElement) {
            return [];
        }

        $xml->registerXPathNamespace('yt', 'http://www.youtube.com/xml/schemas/2015');
        $xml->registerXPathNamespace('media', 'http://search.yahoo.com/mrss/');

        $videos = [];

        foreach ($xml->entry as $entry) {
            $entry->registerXPathNamespace('yt', 'http://www.youtube.com/xml/schemas/2015');
            $entry->registerXPathNamespace('media', 'http://search.yahoo.com/mrss/');

            $id = (string) ($entry->children('yt', true)->videoId ?? '');
            if ($id === '') {
                continue;
            }

            $descriptionNode = $entry->xpath('media:group/media:description');
            $description = isset($descriptionNode[0]) ? trim((string) $descriptionNode[0]) : null;

            $viewsNode = $entry->xpath('media:group/media:community/media:statistics');
            $viewCount = 0;
            if (isset($viewsNode[0]['views'])) {
                $viewCount = (int) $viewsNode[0]['views'];
            }

            $published = trim((string) ($entry->published ?? ''));
            if ($published === '') {
                $published = trim((string) ($entry->updated ?? ''));
            }

            $videos[] = [
                'id' => $id,
                'title' => trim(html_entity_decode((string) $entry->title, ENT_QUOTES | ENT_HTML5, 'UTF-8')),
                'description' => $description !== '' ? $description : null,
                'url' => YouTube::watchUrl($id),
                'view_count' => $viewCount,
                'published_at' => $published !== '' ? self::normalizePublishedAt($published) : null,
            ];
        }

        return $videos;
    }

    /**
     * @return list<string>
     */
    protected static function fetchVideoIdsFromUploadsPlaylist(string $channelId): array
    {
        $response = self::httpClient()->get('https://www.youtube.com/playlist', [
            'list' => self::uploadsPlaylistId($channelId),
        ]);

        if (! $response->successful()) {
            return self::fetchVideoIdsFromVideosPage(self::MINDANAO_ROADTRIP_HANDLE);
        }

        preg_match_all('/"videoId":"([A-Za-z0-9_-]{11})"/', $response->body(), $matches);

        return array_values(array_unique($matches[1] ?? []));
    }

    protected static function uploadsPlaylistId(string $channelId): string
    {
        if (str_starts_with($channelId, 'UC')) {
            return 'UU'.substr($channelId, 2);
        }

        return $channelId;
    }

    /**
     * @return list<string>
     */
    protected static function fetchVideoIdsFromVideosPage(string $handle): array
    {
        $response = self::httpClient()->get("https://www.youtube.com/@{$handle}/videos");

        if (! $response->successful()) {
            return [];
        }

        preg_match_all('/"videoId":"([A-Za-z0-9_-]{11})"/', $response->body(), $matches);

        return array_values(array_unique($matches[1] ?? []));
    }

    protected static function fetchVideoTitle(string $videoId): ?string
    {
        $response = self::httpClient()->get('https://www.youtube.com/oembed', [
            'url' => YouTube::watchUrl($videoId),
            'format' => 'json',
        ]);

        if (! $response->successful()) {
            return null;
        }

        $title = $response->json('title');

        return is_string($title) && $title !== '' ? html_entity_decode($title, ENT_QUOTES | ENT_HTML5, 'UTF-8') : null;
    }

    /**
     * @return array{view_count: int, published_at: ?string}
     */
    public static function fetchVideoMetadata(string $videoId): array
    {
        $response = self::httpClient()
            ->withOptions(['stream' => true])
            ->get(YouTube::watchUrl($videoId));

        if (! $response->successful()) {
            return [
                'view_count' => 0,
                'published_at' => null,
            ];
        }

        $viewCount = 0;
        $publishedAt = null;
        $buffer = '';
        $stream = $response->toPsrResponse()->getBody();

        while (! $stream->eof()) {
            $buffer .= $stream->read(16384);

            if ($viewCount === 0 && preg_match('/"viewCount":"(\d+)"/', $buffer, $matches)) {
                $viewCount = (int) $matches[1];
            }

            if ($publishedAt === null && (
                preg_match('/"uploadDate":"([^"]+)"/', $buffer, $matches)
                || preg_match('/"publishDate":"([^"]+)"/', $buffer, $matches)
                || preg_match('/"datePublished":"([^"]+)"/', $buffer, $matches)
            )) {
                $publishedAt = self::normalizePublishedAt($matches[1]);
            }

            if ($viewCount > 0 && $publishedAt !== null) {
                break;
            }

            if (strlen($buffer) > 524288) {
                $buffer = substr($buffer, -262144);
            }
        }

        $stream->close();

        return [
            'view_count' => $viewCount,
            'published_at' => $publishedAt,
        ];
    }

    public static function fetchViewCount(string $videoId): int
    {
        return self::fetchVideoMetadata($videoId)['view_count'];
    }

    protected static function normalizePublishedAt(string $value): ?string
    {
        $timestamp = strtotime($value);

        if ($timestamp === false) {
            return null;
        }

        return gmdate('Y-m-d H:i:s', $timestamp);
    }
}
