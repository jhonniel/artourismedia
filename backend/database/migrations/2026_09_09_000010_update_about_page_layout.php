<?php

use App\Support\AboutPageMetadata;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $metadata = AboutPageMetadata::defaults();

        DB::table('pages')
            ->where('slug', 'about')
            ->update([
                'title' => 'About Art Boncato',
                'content' => $metadata['career_body'],
                'metadata' => json_encode($metadata),
                'seo_title' => 'About Art Boncato | ArTourisMedia',
                'seo_description' => 'Learn about Art Boncato, Jr.—tourism and hospitality executive leading ArTourisMedia with bespoke solutions for destinations across the Philippines.',
                'updated_at' => now(),
            ]);
    }

    public function down(): void
    {
        DB::table('pages')
            ->where('slug', 'about')
            ->update([
                'content' => '<p>Art Boncato, Jr. is a tourism and hospitality executive who continues to build on a career spanning 30 years.</p>'
                    .'<p>He has spent the past 10 years in several senior leadership roles as the Group General Manager of Megaworld Hotels and Resorts; Executive Vice President and Chief Operating Officer of the World Trade Center Metro Manila; Regional Director, Assistant Secretary, and Undersecretary of the Philippine Department of Tourism; and Assistant Secretary of the Department of Trade and Industry seconded to the Department of Finance to organize the 51st Asian Development Bank Summit in Manila.</p>'
                    .'<p>He is now steering ArTourisMedia, a team that delivers bespoke tourism solutions for planning and development, branding and marketing, learning and development, MICE execution, and a partner in advocating tourism growth in Mindanao.</p>',
                'metadata' => null,
                'updated_at' => now(),
            ]);
    }
};
