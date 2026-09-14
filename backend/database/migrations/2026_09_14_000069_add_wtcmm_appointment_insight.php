<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    private const SLUG = 'art-boncato-jr-world-trade-center-metro-manila-2023';

    private const SOURCE_URL = 'https://www.ttgmice.com/2023/03/20/art-boncato-jr-moves-to-world-trade-center-metro-manila/';

    public function up(): void
    {
        if (! DB::getSchemaBuilder()->hasTable('posts')) {
            return;
        }

        $authorId = DB::table('users')->orderBy('id')->value('id');
        $mediaCategoryId = DB::table('post_categories')->where('slug', 'media')->value('id');

        if (! $authorId || ! $mediaCategoryId) {
            return;
        }

        $publishedAt = now()->subMinutes(5);
        $payload = [
            'post_category_id' => $mediaCategoryId,
            'author_id' => $authorId,
            'slug' => self::SLUG,
            'title' => 'Art Boncato, Jr moves to World Trade Center Metro Manila',
            'excerpt' => 'Art Boncato Jr. has joined World Trade Center Metro Manila as chief operating officer and executive vice president, following his tenure as Department of Tourism undersecretary.',
            'content' => $this->content(),
            'featured_image_url' => '/images/posts/art-boncato-wtcmm-appointment.png',
            'status' => 'published',
            'is_featured' => true,
            'reading_time' => 2,
            'published_at' => $publishedAt,
            'seo_title' => 'Art Boncato Jr Joins World Trade Center Metro Manila | TTGmice',
            'seo_description' => 'TTGmice reports on Art Boncato Jr.\'s appointment as COO and executive vice president of World Trade Center Metro Manila.',
            'allow_social_sharing' => true,
            'updated_at' => now(),
        ];

        $existing = DB::table('posts')->where('slug', self::SLUG)->first();

        if ($existing) {
            DB::table('posts')->where('id', $existing->id)->update($payload);

            return;
        }

        DB::table('posts')->insert(array_merge($payload, [
            'uuid' => (string) Str::uuid(),
            'created_at' => now(),
        ]));
    }

    public function down(): void
    {
        if (! DB::getSchemaBuilder()->hasTable('posts')) {
            return;
        }

        DB::table('posts')->where('slug', self::SLUG)->delete();
    }

    private function content(): string
    {
        return '<p>Art Boncato, Jr has joined the World Trade Center Metro Manila as chief operating officer and executive vice president.</p>'
            .'<p>He was previously the Philippine Department of Tourism undersecretary for tourism regulation, coordination and resource generation.</p>'
            .'<p><em>— TTGmice</em></p>'
            .'<p><em>Originally published March 20, 2023 on <a href="'.self::SOURCE_URL.'" target="_blank" rel="noopener noreferrer">TTGmice</a>.</em></p>'
            .'<p><a href="'.self::SOURCE_URL.'" target="_blank" rel="noopener noreferrer">Read the full article on TTGmice</a></p>';
    }
};
