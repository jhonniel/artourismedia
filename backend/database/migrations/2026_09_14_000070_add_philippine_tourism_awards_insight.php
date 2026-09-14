<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    private const SLUG = 'northern-mindanao-philippine-tourism-awards-2025';

    private const SOURCE_URL = 'https://metrocdodev.com/2025/09/09/northern-mindanao-shines-at-1st-philippine-tourism-awards/';

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
            'title' => 'Northern Mindanao shines at 1st Philippine Tourism Awards',
            'excerpt' => 'Northern Mindanao stood out at the inaugural Philippine Tourism Awards at Okada Manila, with Camiguin, Proforg, The VIP Hotel, De Luxe Hotel, and Chali Resort and Conference Center bringing home national honors.',
            'content' => $this->content(),
            'featured_image_url' => '/images/posts/philippine-tourism-awards-collage.jpg',
            'status' => 'published',
            'is_featured' => true,
            'reading_time' => 4,
            'published_at' => $publishedAt,
            'seo_title' => 'Northern Mindanao Philippine Tourism Awards 2025 | Art Boncato',
            'seo_description' => 'Camiguin, Cagayan de Oro hotels, and Proforg honored at the 1st Philippine Tourism Awards in Okada Manila.',
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
        $img = static fn (string $path, string $alt): string => '<figure class="my-8 overflow-hidden rounded-2xl"><img src="'.$path.'" alt="'.htmlspecialchars($alt, ENT_QUOTES).'" class="w-full" loading="lazy" /></figure>';

        return '<p><strong>PROGRESS WATCH: Metro Cagayan de Oro and Northern Mindanao</strong></p>'
            .$img('/images/posts/philippine-tourism-awards-collage.jpg', 'Northern Mindanao awardees at the 1st Philippine Tourism Awards')
            .'<p>Northern Mindanao proudly stood out at the 1st Philippine Tourism Awards held on September 8, 2025, at Okada Manila, as several homegrown names brought home prestigious recognitions. Among the awardees were the Province of Camiguin, Professional Organizers Unlimited, VIP Hotel, De Luxe Hotel, and Chali Beach Resort, each honored in their respective categories. These accolades reaffirm the region\'s rising reputation as a prime destination for leisure, business, and sustainable travel in the Philippines. Congratulations to all awardees!</p>'
            .'<p>The Province of Camiguin received the Ecotourism Destination Award for Mantigue Island, solidifying its reputation as one of the country\'s premier nature destinations. Camiguin Provincial Tourism Officer Candice Dael is shown with the award.</p>'
            .$img('/images/posts/philippine-tourism-awards-camiguin-mantigue.jpg', 'Camiguin Provincial Tourism Officer Candice Dael receives the Ecotourism Destination Award for Mantigue Island')
            .'<p>Cagayan de Oro-based Professional Organizers Unlimited, Inc. (Proforg) was also honored with the Tourism Excellence Award for MICE Organizer, highlighting its contribution to business events and conferences in the region. Proforg Managing Director Helen Uy (2nd from right) is shown receiving the award.</p>'
            .$img('/images/posts/philippine-tourism-awards-group-stage.png', 'Professional Organizers Unlimited receives the Tourism Excellence Award for MICE Organizer')
            .'<p>For the Tourism Pillar Award – Enterprise, three iconic Cagayan de Oro hotels and resorts—The VIP Hotel, De Luxe Hotel, and Chali Resort and Conference Center—were recognized for their decades of service. Receiving their respective awards were The VIP Hotel General Manager, De Luxe Hotel General Manager Jeffrey Limbonhai, and Chali Resort General Manager Ging Chaves.</p>'
            .$img('/images/posts/philippine-tourism-awards-hotels.png', 'Tourism Pillar Award recipients from Cagayan de Oro hotels and resorts')
            .$img('/images/posts/philippine-tourism-awards-group-finale.png', 'Northern Mindanao awardees with Tourism Regional Director Marie Elaine Salvaña Unchuan')
            .'<p>The awardees from Northern Mindanao pose together with Tourism Regional Director Marie Elaine Salvaña Unchuan.</p>'
            .'<p><em>Photos by the Department of Tourism.</em></p>'
            .'<p><em>Originally published September 9, 2025 on <a href="'.self::SOURCE_URL.'" target="_blank" rel="noopener noreferrer">MetroCDODev.com</a>.</em></p>'
            .'<p><a href="'.self::SOURCE_URL.'" target="_blank" rel="noopener noreferrer">Read the full article on MetroCDODev.com</a></p>';
    }
};
