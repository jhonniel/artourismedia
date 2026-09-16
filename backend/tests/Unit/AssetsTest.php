<?php

namespace Tests\Unit;

use App\Support\Assets;
use Illuminate\Support\Facades\Config;
use Tests\TestCase;

class AssetsTest extends TestCase
{
    public function test_rewrite_content_html_leaves_admin_paths_unchanged_without_cdn_base(): void
    {
        Config::set('assets.base_url', '');

        $html = '<p><img src="/images/posts/example.jpg" alt=""></p>';

        $this->assertSame($html, Assets::rewriteContentHtml($html));
    }

    public function test_rewrite_content_html_rewrites_inline_image_paths_for_cdn(): void
    {
        Config::set('assets.base_url', 'https://cdn.example.com/static');

        $html = '<p><img src="/images/posts/example.jpg?v=2" alt=""></p>';

        $this->assertSame(
            '<p><img src="https://cdn.example.com/static/images/posts/example.jpg?v=2" alt=""></p>',
            Assets::rewriteContentHtml($html)
        );
    }

    public function test_normalize_asset_reference_rewrites_legacy_playground_cdn(): void
    {
        Config::set('assets.base_url', 'https://cdn.example.com/static');

        $legacy = 'https://infosoft-playground.sgp1.digitaloceanspaces.com/tingog/reports/static/images/brand/logo.png?v=3';

        $this->assertSame(
            'https://cdn.example.com/static/images/brand/logo.png?v=3',
            Assets::normalizeAssetReference($legacy)
        );
    }

    public function test_transform_public_value_rewrites_metadata_urls(): void
    {
        Config::set('assets.base_url', 'https://cdn.example.com/static');

        $metadata = [
            'portrait_url' => '/images/about/art-boncato-portrait-card.png?v=3',
            'nested' => ['image_url' => '/images/hero/hero-slideshow-01-pamulak-float.jpg'],
        ];

        $this->assertSame(
            'https://cdn.example.com/static/images/about/art-boncato-portrait-card.png?v=3',
            Assets::transformPublicValue($metadata)['portrait_url']
        );
    }
}
