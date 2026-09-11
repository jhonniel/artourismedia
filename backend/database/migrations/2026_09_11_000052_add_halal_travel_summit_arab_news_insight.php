<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    private const SOURCE_URL = 'https://www.arabnews.com/world/philippines-recognized-as-rising-muslim-friendly-destination-at-halal-travel-summit-2604468';

    public function up(): void
    {
        $authorId = DB::table('users')->orderBy('id')->value('id');
        $mediaCategoryId = DB::table('post_categories')->where('slug', 'media')->value('id');

        if (! $authorId || ! $mediaCategoryId) {
            return;
        }

        $slug = 'philippines-rising-muslim-friendly-destination-halal-travel-summit';

        $payload = [
            'post_category_id' => $mediaCategoryId,
            'author_id' => $authorId,
            'slug' => $slug,
            'title' => 'Philippines recognized as rising Muslim-friendly destination at halal travel summit',
            'excerpt' => 'Coverage from Arab News on the Philippines\' rising Muslim-friendly destination status, Megaworld Hotels & Resorts\' hotel chain award, and leadership recognition at the Halal in Travel Global Summit in Singapore.',
            'content' => '<p>The Philippines has been recognized as a rising Muslim-friendly destination at the Halal in Travel Global Summit in Singapore, alongside Thailand, Ireland, and Spain in the Rising Muslim-friendly non-OIC Destinations category of the Mastercard-CrescentRating Global Muslim Travel Index.</p>'
                .'<p>At the summit, Philippine Tourism Undersecretary Myra Paz Abubakar was named Halal Travel Personality of the Year, while Megaworld Hotels &amp; Resorts received the Muslim-friendly Hotel Chain of the Year Award. Tourism Undersecretary Abubakar noted that the Department of Tourism is on the right track with programs for Muslim-friendly and halal tourism, with much more work ahead to serve a market projected to reach 245 million international arrivals by 2030.</p>'
                .'<p>The coverage highlights the Philippines\' continued efforts to expand halal-ready products and services—from Muslim-friendly airports to inclusive destination experiences—as part of a broader strategy to diversify international tourism markets.</p>'
                .'<p><a href="'.self::SOURCE_URL.'" target="_blank" rel="noopener noreferrer">Read the full article on Arab News</a> (June 14, 2025).</p>',
            'featured_image_url' => '/images/services/tourism-planning-development.jpg?v=4',
            'status' => 'published',
            'is_featured' => true,
            'reading_time' => 4,
            'published_at' => now(),
            'seo_title' => 'Philippines Muslim-Friendly Destination Recognition | Arab News | Art Boncato',
            'seo_description' => 'Arab News reports on the Philippines\' rising Muslim-friendly destination status and Megaworld Hotels & Resorts\' award at the Halal in Travel Global Summit.',
            'allow_social_sharing' => true,
            'updated_at' => now(),
        ];

        $existing = DB::table('posts')->where('slug', $slug)->first();

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
        DB::table('posts')
            ->where('slug', 'philippines-rising-muslim-friendly-destination-halal-travel-summit')
            ->delete();
    }
};
