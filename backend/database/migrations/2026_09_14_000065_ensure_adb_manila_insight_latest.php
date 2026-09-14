<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    private const SLUG = 'dof-dti-adb-meeting-manila-2018';

    private const SOURCE_URL = 'https://www.gmanetwork.com/news/money/companies/616783/dof-dti-to-team-up-in-hosting-adb-meeting-in-manila-next-yr/story/';

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

        $publishedAt = now();
        $payload = [
            'post_category_id' => $mediaCategoryId,
            'author_id' => $authorId,
            'slug' => self::SLUG,
            'title' => 'DOF, DTI to team-up in hosting ADB meeting in Manila next yr.',
            'excerpt' => 'The Department of Finance tapped the Department of Trade and Industry—and Trade Assistant Secretary Arturo Boncato Jr.—to help organize the 51st annual meeting of the Asian Development Bank board of governors in Manila.',
            'content' => $this->content(),
            'featured_image_url' => '/images/services/mice-management.jpg?v=2',
            'status' => 'published',
            'is_featured' => true,
            'reading_time' => 3,
            'published_at' => $publishedAt,
            'seo_title' => 'DOF, DTI Host ADB Meeting Manila 2018 | Art Boncato | GMA News',
            'seo_description' => 'GMA News reports on Arturo Boncato Jr. supporting DOF and DTI in organizing the 51st Asian Development Bank board of governors meeting in Manila.',
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
        return '<p>The Department of Finance (DOF) on Monday said it has tapped the expertise of the Department of Trade and Industry (DTI) in organizing the 51st annual meeting of the Asian Development Bank (ADB) board of governors.</p>'
            .'<p>Trade Assistant Secretary Arturo Boncato Jr., head of the DTI Competitiveness and Ease of Doing Business Group and a marketing and communications expert, will help the DOF organize the ADB Board of Governors meeting in Manila on May 3 to 6, 2018.</p>'
            .'<p>Finance Secretary Carlos G. Dominguez III was appointed chairman of the ADB Board of Governors in May, succeeding Japan Deputy Prime Minister and Finance Minister Taro Aso who chaired the 50th Annual Meeting in Yokohama.</p>'
            .'<p>Under the administration of former President Benigno Aquino III, Boncato was assistant secretary at the Department of Tourism and was in charge of handling special projects for Mindanao.</p>'
            .'<p><em>— Jon Viktor Cabuenas/VDS, GMA News</em></p>'
            .'<p><em>Originally published July 4, 2017 on <a href="'.self::SOURCE_URL.'" target="_blank" rel="noopener noreferrer">GMA News</a>.</em></p>'
            .'<p><a href="'.self::SOURCE_URL.'" target="_blank" rel="noopener noreferrer">Read the full article on GMA News</a></p>';
    }
};
