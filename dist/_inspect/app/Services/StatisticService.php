<?php

namespace App\Services;

use App\Models\Statistic;

class StatisticService extends CrudService
{
    public function __construct(ActivityLogService $activityLog)
    {
        parent::__construct(new Statistic, $activityLog, 'statistic');
    }

    protected function shouldFlushPublicCache(): bool
    {
        return true;
    }

    protected function searchableColumns(): array
    {
        return ['title', 'number'];
    }
}
