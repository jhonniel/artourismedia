<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    protected function homepageAboutBody(): string
    {
        return '<p>For over 30 years, Art Boncato has shaped tourism and hospitality through strategic leadership, destination development, and national tourism initiatives—driving sustainable growth and creating opportunities for communities across the Philippines, especially Mindanao.</p>';
    }

    protected function aboutPageBody(): string
    {
        return '<p>Art Boncato, Jr. is a tourism and hospitality executive who continues to build on a career spanning 30 years.</p>'
            .'<p>He has spent the past 10 years in several senior leadership roles as the Group General Manager of Megaworld Hotels and Resorts; Executive Vice President and Chief Operating Officer of the World Trade Center Metro Manila; Regional Director, Assistant Secretary, and Undersecretary of the Philippine Department of Tourism; and Assistant Secretary of the Department of Trade and Industry seconded to the Department of Finance to organize the 51st Asian Development Bank Summit in Manila.</p>'
            .'<p>He is now steering ArTourisMedia, a team that delivers bespoke tourism solutions for planning and development, branding and marketing, learning and development, MICE execution, and a partner in advocating tourism growth in Mindanao.</p>';
    }

    public function up(): void
    {
        $this->updateHomepageAboutBody($this->homepageAboutBody());

        DB::table('pages')
            ->where('slug', 'about')
            ->update([
                'title' => 'About Art Boncato',
                'content' => $this->aboutPageBody(),
                'seo_title' => 'About Art Boncato | ArTourisMedia',
                'seo_description' => 'Learn about Art Boncato, Jr.—tourism and hospitality executive leading ArTourisMedia with bespoke solutions for destinations across the Philippines.',
                'updated_at' => now(),
            ]);
    }

    public function down(): void
    {
        $this->updateHomepageAboutBody(
            '<p>Art Boncato, Jr. is a tourism and hospitality executive who continues to build on a career spanning 30 years.</p>'
            .'<p>He has spent the past 10 years in several senior leadership roles as the Group General Manager of Megaworld Hotels and Resorts; Executive Vice President and Chief Operating Officer of the World Trade Center Metro Manila; Regional Director, Assistant Secretary, and Undersecretary of the Philippine Department of Tourism; and Assistant Secretary of the Department of Trade and Industry seconded to the Department of Finance to organize the 51st Asian Development Bank Summit in Manila.</p>'
            .'<p>He is now steering ArTourisMedia, a team that delivers bespoke tourism solutions for planning and development, branding and marketing, learning and development, MICE execution, and a partner in advocating tourism growth in Mindanao.</p>'
        );

        DB::table('pages')
            ->where('slug', 'about')
            ->update([
                'title' => 'About Destination Studio',
                'content' => '<p>Destination Studio is a tourism consultancy helping places tell better stories, welcome more visitors, and grow responsibly. Our multidisciplinary team combines strategy, creative, and analytics to deliver measurable impact for destinations across the Philippines and Southeast Asia.</p>',
                'seo_title' => 'About Us | Destination Studio',
                'seo_description' => 'Meet the team behind Destination Studio, a strategic tourism consultancy for destinations.',
                'updated_at' => now(),
            ]);
    }

    protected function updateHomepageAboutBody(string $body): void
    {
        $sections = DB::table('homepage_sections')
            ->where('type', 'about')
            ->get();

        foreach ($sections as $section) {
            $content = json_decode($section->content ?? '{}', true);

            if (! is_array($content)) {
                continue;
            }

            $content['body'] = $body;

            DB::table('homepage_sections')
                ->where('id', $section->id)
                ->update([
                    'content' => json_encode($content),
                    'updated_at' => now(),
                ]);
        }
    }
};
