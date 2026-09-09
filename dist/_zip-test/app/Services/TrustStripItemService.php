<?php

namespace App\Services;

use App\Models\TrustStripItem;

class TrustStripItemService extends CrudService
{
    public function __construct(ActivityLogService $activityLog)
    {
        parent::__construct(new TrustStripItem, $activityLog, 'trust_strip_item');
    }

    protected function shouldFlushPublicCache(): bool
    {
        return true;
    }

    protected function searchableColumns(): array
    {
        return ['title', 'description'];
    }
}
