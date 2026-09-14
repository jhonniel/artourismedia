<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    private const SLUG = 'megaworld-hotels-resorts-new-appointments-2024';

    private const SOURCE_URL = 'https://www.ttgmice.com/2024/04/02/megaworld-hotels-and-resorts-announces-new-appointments/';

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
            'title' => 'Megaworld Hotels and Resorts announces new appointments',
            'excerpt' => 'Megaworld Hotels and Resorts has named Art Boncato Jr as group general manager, following his tenure as executive vice president and chief operating officer of World Trade Center Metro Manila.',
            'content' => $this->content(),
            'featured_image_url' => '/images/posts/megaworld-art-boncato-appointment.png',
            'status' => 'published',
            'is_featured' => true,
            'reading_time' => 2,
            'published_at' => $publishedAt,
            'seo_title' => 'Megaworld Hotels and Resorts Appointments | Art Boncato | TTGmice',
            'seo_description' => 'TTGmice reports on Art Boncato Jr\'s appointment as group general manager of Megaworld Hotels and Resorts.',
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
        return '<p>Megaworld Hotels and Resorts has named Art Boncato Jr as group general manager. Boncato used to be executive vice president and chief operating officer of World Trade Center Metro Manila.</p>'
            .'<p>Joe Fijardo is now general manager of 1,500-key Grand Westside Hotel Manila which is opening in June. Oliver Esguerra replaced Fijardo as general manager of Kingsford Hotel Manila.</p>'
            .'<p>Maia Israel has taken over from Elmar Lima as general manager of Belmont Boracay. She worked under various capacities in Song Saa Private Island in Cambodia, Courtyard by Marriott Philippines, Laucala Island in Fiji and Radisson Blu Fiji.</p>'
            .'<p><em>— TTGmice</em></p>'
            .'<p><em>Originally published April 2, 2024 on <a href="'.self::SOURCE_URL.'" target="_blank" rel="noopener noreferrer">TTGmice</a>.</em></p>'
            .'<p><a href="'.self::SOURCE_URL.'" target="_blank" rel="noopener noreferrer">Read the full article on TTGmice</a></p>';
    }
};
