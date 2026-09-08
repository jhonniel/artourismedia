<?php

namespace App\Services;

use App\Models\Service;
use App\Models\ServiceVideo;
use App\Support\YouTube;
use Illuminate\Support\Collection;

class ServiceVideoService extends CrudService
{
    public const MINDANAO_CONNECT_SLUG = 'mindanao-connect';

    public function __construct(ActivityLogService $activityLog)
    {
        parent::__construct(new ServiceVideo, $activityLog, 'service_video');
    }

    protected function shouldFlushPublicCache(): bool
    {
        return true;
    }

    public function mindanaoConnectService(): Service
    {
        return Service::query()
            ->where('slug', self::MINDANAO_CONNECT_SLUG)
            ->firstOrFail();
    }

    public function forService(int $serviceId): Collection
    {
        return ServiceVideo::query()
            ->where('service_id', $serviceId)
            ->orderByDesc('published_at')
            ->orderBy('sort_order')
            ->get();
    }

    public function createForMindanaoConnect(array $data): ServiceVideo
    {
        $service = $this->mindanaoConnectService();

        return $this->create(array_merge($data, [
            'service_id' => $service->id,
            'youtube_id' => YouTube::extractId($data['youtube_url']),
        ]));
    }

    public function updateVideo(ServiceVideo $video, array $data): ServiceVideo
    {
        if (isset($data['youtube_url'])) {
            $data['youtube_id'] = YouTube::extractId($data['youtube_url']);
        }

        return $this->update($video, $data);
    }

    protected function searchableColumns(): array
    {
        return ['title', 'description', 'youtube_url'];
    }
}
