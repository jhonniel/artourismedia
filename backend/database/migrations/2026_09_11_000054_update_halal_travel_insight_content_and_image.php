<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private const SOURCE_URL = 'https://www.arabnews.com/world/philippines-recognized-as-rising-muslim-friendly-destination-at-halal-travel-summit-2604468';

    public function up(): void
    {
        DB::table('posts')
            ->where('slug', 'philippines-rising-muslim-friendly-destination-halal-travel-summit')
            ->update([
                'excerpt' => 'Developing halal travel has been a key part of the Philippines\' tourism strategy as the Muslim travel market is expected to reach 245 million international arrivals by 2030.',
                'content' => $this->content(),
                'featured_image_url' => '/images/posts/halal-travel-summit-award.jpg',
                'reading_time' => 6,
                'updated_at' => now(),
            ]);
    }

    public function down(): void
    {
        DB::table('posts')
            ->where('slug', 'philippines-rising-muslim-friendly-destination-halal-travel-summit')
            ->update([
                'excerpt' => 'Coverage from Arab News on the Philippines\' rising Muslim-friendly destination status, Megaworld Hotels & Resorts\' hotel chain award, and leadership recognition at the Halal in Travel Global Summit in Singapore.',
                'content' => '<p>The Philippines has been recognized as a rising Muslim-friendly destination at the Halal in Travel Global Summit in Singapore, alongside Thailand, Ireland, and Spain in the Rising Muslim-friendly non-OIC Destinations category of the Mastercard-CrescentRating Global Muslim Travel Index.</p><p>At the summit, Philippine Tourism Undersecretary Myra Paz Abubakar was named Halal Travel Personality of the Year, while Megaworld Hotels &amp; Resorts received the Muslim-friendly Hotel Chain of the Year Award.</p><p><a href="'.self::SOURCE_URL.'" target="_blank" rel="noopener noreferrer">Read the full article on Arab News</a> (June 14, 2025).</p>',
                'featured_image_url' => '/images/services/tourism-planning-development.jpg?v=4',
                'reading_time' => 4,
                'updated_at' => now(),
            ]);
    }

    private function content(): string
    {
        return '<ul>'
            .'<li>Developing halal travel has been key part of the Philippines\' tourism strategy</li>'
            .'<li>Muslim travel market expected to reach 245 million international arrivals by 2030</li>'
            .'</ul>'
            .'<p><strong>MANILA:</strong> The Philippines has been recognized as a rising Muslim-friendly destination at this year\'s Halal in Travel Global Summit, where one of the country\'s officials and a Filipino hotel chain were also honored for their work in promoting halal tourism.</p>'
            .'<p>The Philippines stands among three other countries — Thailand, Ireland and Spain — in the Rising Muslim-friendly non-Organization of Islamic Cooperation Destinations in the latest edition of the Mastercard-CrescentRating Global Muslim Travel Index.</p>'
            .'<p>The index is an annual report benchmarking destinations in the Muslim travel market.</p>'
            .'<p>At the summit in Singapore earlier this week, Philippine Tourism Undersecretary Myra Paz Abubakar was named Halal Travel Personality of the Year, while the country\'s largest hotel operator, Megaworld Hotels and Resorts, won the Muslim-friendly Hotel Chain of the Year Award.</p>'
            .'<p>“This means that the DOT (Department of Tourism) is on the right track with our programs for Muslim-friendly and halal tourism. We have already done a lot but there is still so much to be done,” Abubakar, who was recognized for her “instrumental role” in advancing Muslim-friendly tourism in the Philippines, told Arab News on Saturday.</p>'
            .'<p>The archipelagic country, known for its white-sand beaches, diving spots and rich culture, has in recent years stepped up efforts to cater to Muslim tourists by ensuring that they have access to halal products and services.</p>'
            .'<p>“We have to continue moving forward and upward as the Muslim Market is a big market waiting to be tapped,” Abubakar said.</p>'
            .'<p>The Muslim travel market is on the rise, with international Muslim arrivals reaching 176 million people in 2024, according to the GMTI. The report estimates that the market will grow to 245 million arrivals by 2030, with their travel expenditure reaching $235 billion.</p>'
            .'<p>The index has noted the Philippines\' efforts to become a Muslim-friendly destination since 2021, and awarded the country the Emerging Muslim-friendly Destination accolade at the halal travel summit in 2023.</p>'
            .'<p>While the category has been removed for the 2025 edition, the GMTI covered the Philippines and its efforts to promote halal tourism, such as establishing more Muslim-friendly airports, to create a more inclusive travel experience.</p>'
            .'<p>The predominantly Catholic country — where Muslims constitute about 10 percent of the almost 120 million population — also launched last year a beach dedicated to Muslim women travelers in Boracay, the country\'s top resort island and one of the world\'s most popular.</p>'
            .'<p>Those efforts, part of the Philippines\' move to diversify its economy away from dependency on the declining Chinese market, have led to a recent surge in international tourism arrivals from countries in the Middle East and the Gulf Cooperation Council.</p>'
            .'<p><a href="'.self::SOURCE_URL.'" target="_blank" rel="noopener noreferrer">Read the full article on Arab News</a> (June 14, 2025).</p>';
    }
};
