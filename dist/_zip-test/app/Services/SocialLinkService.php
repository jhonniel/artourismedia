<?php

namespace App\Services;

use App\Models\SocialLink;

class SocialLinkService extends CrudService
{
    public function __construct(ActivityLogService $activityLog)
    {
        parent::__construct(new SocialLink, $activityLog, 'social_link');
    }

    protected function shouldFlushPublicCache(): bool
    {
        return true;
    }

    public function getPublicLinks(): mixed
    {
        return SocialLink::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();
    }

    protected function searchableColumns(): array
    {
        return ['platform', 'username', 'url'];
    }
}
