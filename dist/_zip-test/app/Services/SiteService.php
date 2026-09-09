<?php

namespace App\Services;

use App\Models\HomepageSection;
use App\Models\NavigationItem;
use App\Models\Post;
use App\Models\Project;
use App\Models\Service;
use App\Models\SiteSetting;
use App\Models\SocialLink;
use App\Models\Statistic;
use App\Models\TrustStripItem;
use Illuminate\Support\Collection;

class SiteService
{
    public function __construct(protected CacheService $cacheService) {}

    public function getPublicSiteData(): array
    {
        $settings = SiteSetting::query()->get();

        return [
            'settings' => $this->flattenSettings($settings),
            'navigation' => NavigationItem::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get(),
            'footer' => $this->buildFooterData($settings),
            'social_links' => SocialLink::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get(),
            'statistics' => Statistic::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get(),
            'trust_strip' => TrustStripItem::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get(),
        ];
    }

    public function listSettings(?string $group = null): Collection
    {
        return SiteSetting::query()
            ->when($group, fn ($q) => $q->where('group', $group))
            ->orderBy('group')
            ->orderBy('key')
            ->get();
    }

    public function upsertSetting(array $data): SiteSetting
    {
        $setting = SiteSetting::updateOrCreate(
            ['key' => $data['key']],
            $data
        );
        $this->cacheService->flushPublic();

        return $setting;
    }

    public function bulkUpdateSettings(array $settings): Collection
    {
        foreach ($settings as $key => $value) {
            $existing = SiteSetting::query()->where('key', $key)->first();

            SiteSetting::updateOrCreate(
                ['key' => $key],
                [
                    'value' => $value,
                    'type' => $existing?->type ?? 'string',
                    'group' => $existing?->group ?? $this->guessGroup($key),
                ]
            );
        }

        $this->cacheService->flushPublic();

        return $this->listSettings();
    }

    public function deleteSetting(SiteSetting $setting): void
    {
        $setting->delete();
        $this->cacheService->flushPublic();
    }

    protected function flattenSettings(Collection $settings): array
    {
        return $settings->mapWithKeys(fn (SiteSetting $setting) => [
            $setting->key => $this->castValue($setting),
        ])->all();
    }

    protected function buildFooterData(Collection $settings): array
    {
        $flat = $this->flattenSettings($settings);

        return [
            'description' => $flat['footer_description'] ?? $flat['tagline'] ?? null,
            'newsletter_title' => $flat['newsletter_title'] ?? 'Stay Connected',
            'newsletter_description' => $flat['newsletter_description'] ?? 'Get destination strategy insights delivered to your inbox.',
            'contact_title' => $flat['contact_title'] ?? 'Contact',
            'contact_email' => $flat['footer_email'] ?? $flat['contact_email'] ?? null,
            'contact_phone' => $flat['footer_phone'] ?? $flat['contact_phone'] ?? null,
            'contact_address' => $flat['footer_address'] ?? $flat['contact_address'] ?? null,
            'copyright' => $flat['footer_copyright'] ?? $flat['footer_text'] ?? null,
            'quick_links' => [
                ['label' => 'About', 'url' => '/about'],
                ['label' => 'Services', 'url' => '/services'],
                ['label' => 'Projects', 'url' => '/projects'],
                ['label' => 'Insights', 'url' => '/insights'],
            ],
            'legal_links' => [
                ['label' => 'Privacy Policy', 'url' => '/privacy-policy'],
                ['label' => 'Terms of Use', 'url' => '/terms-of-use'],
            ],
        ];
    }

    protected function guessGroup(string $key): string
    {
        return match (true) {
            str_starts_with($key, 'contact_') => 'contact',
            str_contains($key, 'color') || str_contains($key, 'logo') || str_contains($key, 'favicon') => 'branding',
            default => 'general',
        };
    }

    protected function castValue(SiteSetting $setting): mixed
    {
        return match ($setting->type) {
            'boolean' => filter_var($setting->value, FILTER_VALIDATE_BOOLEAN),
            'integer' => (int) $setting->value,
            'json' => json_decode($setting->value ?? 'null', true),
            default => $setting->value,
        };
    }
}
