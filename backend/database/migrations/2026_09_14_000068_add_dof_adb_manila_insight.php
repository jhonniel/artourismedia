<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    private const SLUG = 'dof-taps-dti-marketing-expert-adb-manila-2018';

    private const SOURCE_URL = 'https://www.dof.gov.ph/dof-taps-dti-marketing-expert-for-2018-adb-meeting-in-manila/';

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

        $publishedAt = now()->subMinutes(15);
        $payload = [
            'post_category_id' => $mediaCategoryId,
            'author_id' => $authorId,
            'slug' => self::SLUG,
            'title' => 'DOF taps DTI marketing expert for 2018 ADB meeting in Manila',
            'excerpt' => 'The Department of Finance tapped DTI Assistant Secretary Arturo Boncato Jr.—a marketing and communications expert with a record in major Mindanao tourism projects—to help prepare Manila\'s hosting of the 51st ADB Board of Governors meeting.',
            'content' => $this->content(),
            'featured_image_url' => '/images/services/mice-management.jpg?v=2',
            'status' => 'published',
            'is_featured' => true,
            'reading_time' => 3,
            'published_at' => $publishedAt,
            'seo_title' => 'DOF Taps DTI Marketing Expert for 2018 ADB Meeting | Art Boncato',
            'seo_description' => 'Department of Finance announcement on Arturo Boncato Jr. supporting preparations for the 2018 ADB Board of Governors meeting in Manila.',
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
        return '<p>A marketing and communications expert at the Department of Trade and Industry (DTI) with a sterling record in handling major tourism projects in Mindanao is working closely with the Department of Finance (DOF) in handling the preparations for the 2018 annual meeting of the Asian Development Bank (ADB) Board of Governors to be held in Manila.</p>'
            .'<p>Finance Secretary Carlos Dominguez III has tapped DTI Assistant Secretary Arturo Boncato Jr. as a key resource person of the DOF for Manila\'s hosting of the 51st Annual Meeting of the ADB Board of Governors on May 3–6 next year.</p>'
            .'<p>Boncato, who heads the DTI\'s Competitiveness and Ease of Doing Business Group, was formerly Assistant Secretary of the Department of Tourism in the Aquino administration in charge of handling special projects for Mindanao, such as the Philippine Halal Tourism Project. He was at that time also the tourism department\'s alternate spokesperson.</p>'
            .'<p>He had also chaired the Brunei, Indonesia Malaysia, the Philippines-East ASEAN Growth Area (BIMP-EAGA) Tourism Cluster and was Representative to the Bangsamoro Transition Committee.</p>'
            .'<p>Boncato is currently the supervising executive of the DTI\'s Competitiveness Bureau, E-Commerce, and BIMP-EAGA teams.</p>'
            .'<p>A former entrepreneur and hotelier, Boncato holds a Bachelor of Arts Degree in Mass Communications from the University of the Philippines.</p>'
            .'<p>Dominguez chairs the ADB Board of Governors.</p>'
            .'<p>The ADB is headquartered at the Ortigas Business Center in Mandaluyong City.</p>'
            .'<p><em>— Department of Finance</em></p>'
            .'<p><em>Originally published July 5, 2017 on the <a href="'.self::SOURCE_URL.'" target="_blank" rel="noopener noreferrer">Department of Finance</a>.</em></p>'
            .'<p><a href="'.self::SOURCE_URL.'" target="_blank" rel="noopener noreferrer">Read the full article on DOF.gov.ph</a></p>';
    }
};
