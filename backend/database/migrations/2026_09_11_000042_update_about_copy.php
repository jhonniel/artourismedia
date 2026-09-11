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
                'content' => $metadata['career_body'],
                'metadata' => json_encode($metadata),
                'updated_at' => now(),
            ]);

        $aboutSection = DB::table('homepage_sections')->where('type', 'about')->first();

        if (! $aboutSection || empty($aboutSection->content)) {
            return;
        }

        $content = json_decode($aboutSection->content, true);

        if (! is_array($content)) {
            return;
        }

        $content['title'] = 'A Career Built Around Tourism';
        $content['body'] = '<p>Art Boncato, Jr. is a tourism and hospitality executive who continues to build on a career spanning 30 years.</p>';

        DB::table('homepage_sections')
            ->where('id', $aboutSection->id)
            ->update([
                'content' => json_encode($content),
                'updated_at' => now(),
            ]);
    }

    public function down(): void
    {
        $oldHeadline = 'Three Decades of Leadership in Tourism, Hospitality & Destination Development';
        $oldIntro = 'For over 30 years, Art Boncato has shaped tourism and hospitality through strategic leadership, destination development, and national tourism initiatives—driving sustainable growth and creating opportunities for communities across the Philippines, especially Mindanao.';
        $oldCareerBody = '<p>Art Boncato, Jr. is a tourism and hospitality executive who continues to build on a career spanning 30 years.</p>'
            .'<p>He has spent the past 10 years in several senior leadership roles as the Group General Manager of Megaworld Hotels and Resorts; Executive Vice President and Chief Operating Officer of the World Trade Center Metro Manila; Regional Director, Assistant Secretary, and Undersecretary of the Philippine Department of Tourism; and Assistant Secretary of the Department of Trade and Industry seconded to the Department of Finance to organize the 51st Asian Development Bank Summit in Manila.</p>'
            .'<p>He is now steering ArTourisMedia, a team that delivers bespoke tourism solutions for planning and development, branding and marketing, learning and development, MICE execution, and a partner in advocating tourism growth in Mindanao.</p>';

        $page = DB::table('pages')->where('slug', 'about')->first();

        if ($page) {
            $metadata = json_decode($page->metadata ?? '{}', true);

            if (is_array($metadata)) {
                $metadata['headline'] = $oldHeadline;
                $metadata['intro'] = $oldIntro;
                $metadata['career_heading'] = 'A Career Built Around Tourism';
                $metadata['career_body'] = $oldCareerBody;
            }

            DB::table('pages')
                ->where('slug', 'about')
                ->update([
                    'content' => $oldCareerBody,
                    'metadata' => json_encode($metadata),
                    'updated_at' => now(),
                ]);
        }

        $aboutSection = DB::table('homepage_sections')->where('type', 'about')->first();

        if (! $aboutSection || empty($aboutSection->content)) {
            return;
        }

        $content = json_decode($aboutSection->content, true);

        if (! is_array($content)) {
            return;
        }

        unset($content['title']);
        $content['body'] = '<p>'.$oldIntro.'</p>';

        DB::table('homepage_sections')
            ->where('id', $aboutSection->id)
            ->update([
                'content' => json_encode($content),
                'updated_at' => now(),
            ]);
    }
};
