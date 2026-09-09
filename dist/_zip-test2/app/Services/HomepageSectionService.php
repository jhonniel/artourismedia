<?php

namespace App\Services;

use App\Models\HomepageSection;
use App\Models\Post;
use App\Models\Project;
use App\Models\Service;
use App\Models\Statistic;
use App\Models\TrustStripItem;

class HomepageSectionService extends CrudService
{
    public function __construct(ActivityLogService $activityLog)
    {
        parent::__construct(new HomepageSection, $activityLog, 'homepage_section');
    }

    protected function shouldFlushPublicCache(): bool
    {
        return true;
    }

    public function getPublicSections(): mixed
    {
        return HomepageSection::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();
    }

    public function getPublicHomepageData(): array
    {
        return [
            'sections' => $this->getPublicSections(),
            'trust_strip_items' => TrustStripItem::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get(),
            'services' => Service::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get(),
            'featured_projects' => Project::query()
                ->where('is_published', true)
                ->where('is_featured', true)
                ->orderBy('sort_order')
                ->limit(3)
                ->with('category')
                ->get(),
            'statistics' => Statistic::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get(),
            'latest_posts' => Post::query()
                ->where('status', 'published')
                ->whereNotNull('published_at')
                ->where('published_at', '<=', now())
                ->orderByDesc('published_at')
                ->limit(3)
                ->with(['category', 'author'])
                ->get(),
        ];
    }

    protected function searchableColumns(): array
    {
        return ['title', 'type'];
    }
}
