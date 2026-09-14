<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    private const SLUG = 'camiguin-isle-be-there-tourism-campaign';

    private const SOURCE_URL = 'https://www.pna.gov.ph/articles/1197643';

    public function up(): void
    {
        if (! DB::getSchemaBuilder()->hasTable('posts')) {
            return;
        }

        $authorId = DB::table('users')->orderBy('id')->value('id');
        $strategyCategoryId = DB::table('post_categories')->where('slug', 'strategy')->value('id');

        if (! $authorId || ! $strategyCategoryId) {
            return;
        }

        $publishedAt = now();
        $payload = [
            'post_category_id' => $strategyCategoryId,
            'author_id' => $authorId,
            'slug' => self::SLUG,
            'title' => 'Camiguin launches \'Isle be There\' tourism campaign',
            'excerpt' => 'Camiguin rolled out its "Isle be There" rebranding theme to welcome tourists with a fresh post-pandemic start, backed by Smart Tourism, a PHP250-million Mantigue Island plan, and updated visitor guidelines.',
            'content' => $this->content(),
            'featured_image_url' => '/images/posts/camiguin-isle-be-there-campaign.png',
            'status' => 'published',
            'is_featured' => true,
            'reading_time' => 3,
            'published_at' => $publishedAt,
            'seo_title' => 'Camiguin Isle be There Tourism Campaign | Philippine News Agency',
            'seo_description' => 'Camiguin launches its Isle be There tourism rebranding with Smart Tourism, Mantigue Island development, and post-pandemic visitor guidelines.',
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
        return '<figure class="my-8 overflow-hidden rounded-2xl"><img src="/images/posts/camiguin-isle-be-there-campaign.png" alt="Camiguin Isle be There tourism campaign branding" class="w-full max-w-md mx-auto" loading="lazy" /></figure>'
            .'<p><strong>CAGAYAN DE ORO CITY</strong> – The Camiguin provincial government rolled out Friday its "Isle be There" rebranding theme to welcome tourists with a fresh start from the coronavirus disease 2019 pandemic.</p>'
            .'<p>Gov. Xavier Jesus Romualdo said the new tourism slogan is part of the provincial government\'s transformation and development plans, with communities and establishments cooperating for its success.</p>'
            .'<p>"We are also going for the digitalization, to have \'Smart Tourism\' where tourists can enjoy the island (with ease)," Romualdo said during the opening program.</p>'
            .'<p>With the use of technology, the governor said visitors can be given ample service and security throughout their stay in the island province.</p>'
            .'<p>Since January, the governor said the province has received 800,000 tourists and expects to reach a million by 2025.</p>'
            .'<p>Romualdo also bared the PHP250-million worth Mantigue Island Tourism Plan, which aims to improve the facilities for water and power, waste management, docking and mooring, guest services and amenities, safety and security and emergency response.</p>'
            .'<p>Another highlight of Camiguin\'s tourism campaign is the lowering of restrictions on tourists who have not availed of Covid-19 vaccines.</p>'
            .'<p>Under the new directives, unvaccinated tourists can visit the island provided that they present a negative Covid-19 test taken in the last two days from a Department of Health-accredited clinic or testing center.</p>'
            .'<p>Unvaccinated minors aged 11 and below are no longer requested for test results.</p>'
            .'<p><em>— Nef Luczon, Philippine News Agency</em></p>'
            .'<p><em>Originally published March 17, 2023 on the <a href="'.self::SOURCE_URL.'" target="_blank" rel="noopener noreferrer">Philippine News Agency</a>.</em></p>'
            .'<p><a href="'.self::SOURCE_URL.'" target="_blank" rel="noopener noreferrer">Read the full article on PNA.gov.ph</a></p>';
    }
};
