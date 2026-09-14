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
}
