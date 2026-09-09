<?php

namespace App\Services;

use App\Models\Page;
use App\Models\Post;
use App\Models\Project;
use App\Models\Service;
use Illuminate\Support\Facades\Cache;

class SitemapService
{
    public function getUrls(): array
    {
        $frontendUrl = rtrim(config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:5173')), '/');
        $now = now()->toAtomString();

        $static = [
            ['loc' => "{$frontendUrl}/", 'lastmod' => $now, 'changefreq' => 'weekly', 'priority' => '1.0'],
            ['loc' => "{$frontendUrl}/about", 'lastmod' => $now, 'changefreq' => 'monthly', 'priority' => '0.8'],
            ['loc' => "{$frontendUrl}/services", 'lastmod' => $now, 'changefreq' => 'weekly', 'priority' => '0.9'],
            ['loc' => "{$frontendUrl}/projects", 'lastmod' => $now, 'changefreq' => 'weekly', 'priority' => '0.9'],
            ['loc' => "{$frontendUrl}/insights", 'lastmod' => $now, 'changefreq' => 'daily', 'priority' => '0.9'],
            ['loc' => "{$frontendUrl}/contact", 'lastmod' => $now, 'changefreq' => 'monthly', 'priority' => '0.7'],
        ];

        $services = Service::query()
            ->where('is_active', true)
            ->get()
            ->map(fn (Service $s) => [
                'loc' => "{$frontendUrl}/services/{$s->slug}",
                'lastmod' => $s->updated_at?->toAtomString() ?? $now,
                'changefreq' => 'monthly',
                'priority' => '0.7',
            ]);

        $projects = Project::query()
            ->where('is_published', true)
            ->get()
            ->map(fn (Project $p) => [
                'loc' => "{$frontendUrl}/projects/{$p->slug}",
                'lastmod' => $p->updated_at?->toAtomString() ?? $now,
                'changefreq' => 'monthly',
                'priority' => '0.8',
            ]);

        $posts = Post::query()
            ->published()
            ->get()
            ->map(fn (Post $p) => [
                'loc' => "{$frontendUrl}/insights/{$p->slug}",
                'lastmod' => ($p->published_at ?? $p->updated_at)?->toAtomString() ?? $now,
                'changefreq' => 'monthly',
                'priority' => '0.6',
            ]);

        $pages = Page::query()
            ->where('is_published', true)
            ->get()
            ->map(fn (Page $p) => [
                'loc' => "{$frontendUrl}/{$p->slug}",
                'lastmod' => $p->updated_at?->toAtomString() ?? $now,
                'changefreq' => 'monthly',
                'priority' => '0.5',
            ]);

        return collect($static)
            ->concat($services)
            ->concat($projects)
            ->concat($posts)
            ->concat($pages)
            ->values()
            ->all();
    }

    public function toXml(): string
    {
        $urls = Cache::remember('sitemap.urls', 3600, fn () => $this->getUrls());

        $xml = '<?xml version="1.0" encoding="UTF-8"?>'."\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'."\n";

        foreach ($urls as $url) {
            $xml .= "  <url>\n";
            $xml .= '    <loc>'.htmlspecialchars($url['loc'])."</loc>\n";
            $xml .= '    <lastmod>'.$url['lastmod']."</lastmod>\n";
            $xml .= '    <changefreq>'.$url['changefreq']."</changefreq>\n";
            $xml .= '    <priority>'.$url['priority']."</priority>\n";
            $xml .= "  </url>\n";
        }

        $xml .= '</urlset>';

        return $xml;
    }
}
