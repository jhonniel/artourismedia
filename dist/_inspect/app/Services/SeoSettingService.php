<?php

namespace App\Services;

use App\Models\SeoSetting;

class SeoSettingService extends CrudService
{
    public function __construct(ActivityLogService $activityLog)
    {
        parent::__construct(new SeoSetting, $activityLog, 'seo_setting');
    }

    protected function searchableColumns(): array
    {
        return ['page_key', 'title'];
    }
}
