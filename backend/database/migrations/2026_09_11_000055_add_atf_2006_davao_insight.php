<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        $authorId = DB::table('users')->orderBy('id')->value('id');
        $mediaCategoryId = DB::table('post_categories')->where('slug', 'media')->value('id');

        if (! $authorId || ! $mediaCategoryId) {
            return;
        }

        $slug = 'atf-2006-davao-asean-tourism-showcase';

        $payload = [
            'post_category_id' => $mediaCategoryId,
            'author_id' => $authorId,
            'slug' => $slug,
            'title' => 'ATF 2006 in Davao to showcase the best of ASEAN tourism',
            'excerpt' => 'A nine-day ASEAN Tourism Forum in Davao City brought together thousands of regional tourism executives, buyers, and sellers to showcase the best of ASEAN tourism products and cooperation.',
            'content' => $this->content(),
            'featured_image_url' => '/images/hero/hero-slideshow-01-pamulak-float.jpg',
            'status' => 'published',
            'is_featured' => true,
            'reading_time' => 5,
            'published_at' => now(),
            'seo_title' => 'ATF 2006 Davao ASEAN Tourism Forum | Art Boncato',
            'seo_description' => 'How Davao City hosted ASEAN Tourism Forum 2006, showcasing ASEAN tourism products and leadership from Art Boncato and Mayor Rodrigo Duterte.',
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
            ->where('slug', 'atf-2006-davao-asean-tourism-showcase')
            ->delete();
    }

    private function content(): string
    {
        return '<p><strong>DAVAO CITY</strong> — A virtual showcase of the best in tourism products in the Association of Southeast Asian Nations (ASEAN) will be showcased in this southern metropolis when the nine-day ASEAN Tourism Forum (ATF) 2006 kicks off tomorrow.</p>'
            .'<p>According to Art Boncato, chairman of the local host council of the ATF 2006, hundreds of tourism sellers from all over the region shall put their best foot forward for the many buyers joining the much-awaited and biggest tourism event in ASEAN.</p>'
            .'<p>“It would be like traveling to the different parts of ASEAN as everyone would be represented here during the ATF,” he said.</p>'
            .'<p>Boncato said it’s all systems go for the ATF as preparations have gone full-blast for the arrival of more than 3,000 tourism executives and major players not only from the region but from around the world as well.</p>'
            .'<p>“It would be an exciting event as it would not only give us Filipinos the chance to showcase our wealth, but also there would be an exchange of opportunities and continued cooperation among the participants in the ATF,” he said.</p>'
            .'<p>Mayor Rodrigo Duterte said the ATF is seen to help further boost the economic development of the South.</p>'
            .'<p>Duterte has earmarked over P20 million for the necessary infrastructure in preparation for the holding of the ATF and another P7 million for the security requirements of the delegates.</p>'
            .'<p>As part of the infrastructure component, the major thoroughfares are dotted with orchid-shaped lampposts, showing that Davao City is an “orchid city.”</p>'
            .'<p>The ATF 2006 gathers the highest ranking tourism officials of Indonesia, Malaysia, Singapore, Thailand, Brunei Darussalam, Vietnam, Myanmar, Cambodia, Laos and the Philippines.</p>'
            .'<p>Also expected to attend the event are the tourism ministers of Japan, China and South Korea, being part of the “ASEAN + 3” grouping.</p>'
            .'<p>The ATF is expected to lure buyers of tourism products not only from the ASEAN member-nations but also from Europe, the United States and the Middle East.</p>'
            .'<p>All the hotels and inns here have undergone major refurbishing and renovation in preparation for ATF 2006, which shall include a meeting of the ASEAN Joint Tourism Task Force to discuss areas of cooperation in promoting the region’s tourism attractions, facilities, services and investments.</p>'
            .'<p>One of the ATF 2006’s highlights is the meeting of the ASEAN tourism ministers on Jan. 16 to further strengthen their cooperation.</p>'
            .'<p>Various tourism-related ASEAN organizations such as the Federation of ASEAN Travel Associations, Association of ASEAN Airlines, Association of ASEAN Hotels and Restaurants and the ASEAN Tourism Association are holding separate meetings during the nine-day ATF.</p>';
    }
};
