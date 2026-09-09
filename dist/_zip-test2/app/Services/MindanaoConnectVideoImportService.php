<?php

namespace App\Services;

use App\Models\Service;
use App\Models\ServiceVideo;
use App\Support\YouTubeChannelFeed;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class MindanaoConnectVideoImportService
{
    public function __construct(
        protected ServiceVideoService $serviceVideoService,
        protected CacheService $cacheService,
    ) {}

    /**
     * @return array{imported: int, updated: int, total: int}
     */
    public function importFromChannel(?string $channelId = null): array
    {
        $service = $this->serviceVideoService->mindanaoConnectService();
        $videos = YouTubeChannelFeed::fetchChannelVideos($channelId ?? YouTubeChannelFeed::MINDANAO_ROADTRIP_CHANNEL_ID);
        $existingByYoutubeId = ServiceVideo::query()
            ->where('service_id', $service->id)
            ->get()
            ->keyBy('youtube_id');

        $videos = $this->enrichVideos($videos, $existingByYoutubeId);

        usort(
            $videos,
            fn (array $a, array $b) => strcmp($b['published_at'] ?? '', $a['published_at'] ?? '')
        );

        $imported = 0;
        $updated = 0;

        foreach ($videos as $index => $video) {
            try {
                $existing = $existingByYoutubeId->get($video['id']);

                $payload = [
                    'service_id' => $service->id,
                    'youtube_url' => $video['url'],
                    'youtube_id' => $video['id'],
                    'title' => Str::limit($video['title'], 255, ''),
                    'description' => $video['description'] ? Str::limit($video['description'], 5000, '') : null,
                    'view_count' => (int) ($video['view_count'] ?? 0),
                    'published_at' => $video['published_at'] ?? null,
                    'is_active' => true,
                    'sort_order' => $index + 1,
                ];

                if ($existing) {
                    $existing->update($payload);
                    $updated++;
                } else {
                    ServiceVideo::query()->create($payload);
                    $imported++;
                }
            } catch (\Throwable $e) {
                Log::warning('Failed to import Mindanao CONNECT video.', [
                    'youtube_id' => $video['id'] ?? null,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        $channelIds = collect($videos)->pluck('id')->all();

        ServiceVideo::query()
            ->where('service_id', $service->id)
            ->whereNotIn('youtube_id', $channelIds)
            ->delete();

        $this->cacheService->flushPublic();

        Log::info('Mindanao CONNECT videos synced from YouTube.', [
            'imported' => $imported,
            'updated' => $updated,
            'total' => count($videos),
        ]);

        return [
            'imported' => $imported,
            'updated' => $updated,
            'total' => count($videos),
        ];
    }

    /**
     * @param  array<int, array<string, mixed>>  $videos
     * @param  \Illuminate\Support\Collection<string, ServiceVideo>  $existingByYoutubeId
     * @return array<int, array<string, mixed>>
     */
    protected function enrichVideos(array $videos, $existingByYoutubeId): array
    {
        foreach ($videos as $index => $video) {
            $existing = $existingByYoutubeId->get($video['id']);
            $viewCount = (int) ($video['view_count'] ?? 0);
            $publishedAt = $video['published_at'] ?? null;

            if ($viewCount === 0 && $existing?->view_count) {
                $viewCount = (int) $existing->view_count;
            }

            if (! $publishedAt && $existing?->published_at) {
                $publishedAt = $existing->published_at->format('Y-m-d H:i:s');
            }

            if ($viewCount > 0 && $publishedAt) {
                $videos[$index]['view_count'] = $viewCount;
                $videos[$index]['published_at'] = $publishedAt;

                continue;
            }

            try {
                $metadata = YouTubeChannelFeed::fetchVideoMetadata($video['id']);

                if ($viewCount === 0 && $metadata['view_count'] > 0) {
                    $viewCount = $metadata['view_count'];
                }

                if (! $publishedAt && $metadata['published_at']) {
                    $publishedAt = $metadata['published_at'];
                }
            } catch (\Throwable $e) {
                Log::warning('Failed to enrich Mindanao CONNECT video metadata.', [
                    'youtube_id' => $video['id'] ?? null,
                    'error' => $e->getMessage(),
                ]);
            }

            $videos[$index]['view_count'] = $viewCount;
            $videos[$index]['published_at'] = $publishedAt;

            usleep(200_000);
        }

        return $videos;
    }
}
