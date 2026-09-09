<?php

namespace App\Services;

use App\Models\NavigationItem;

class NavigationService extends CrudService
{
    public function __construct(ActivityLogService $activityLog)
    {
        parent::__construct(new NavigationItem, $activityLog, 'navigation');
    }

    protected function shouldFlushPublicCache(): bool
    {
        return true;
    }

    public function getPublicNavigation(): mixed
    {
        return NavigationItem::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();
    }

    protected function searchableColumns(): array
    {
        return ['label', 'url'];
    }
}
