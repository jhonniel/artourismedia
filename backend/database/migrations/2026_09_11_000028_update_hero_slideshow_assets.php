<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $hero = DB::table('homepage_sections')->where('type', 'hero')->first();

        if ($hero && ! empty($hero->content)) {
            $content = json_decode($hero->content, true);

            if (is_array($content)) {
                $content['image_url'] = '/images/hero/hero-slideshow-01-pamulak-float.jpg';

                DB::table('homepage_sections')
                    ->where('id', $hero->id)
                    ->update([
                        'content' => json_encode($content),
                        'updated_at' => now(),
                    ]);
            }
        }

        $page = DB::table('pages')->where('slug', 'about')->first();

        if ($page && ! empty($page->metadata)) {
            $metadata = json_decode($page->metadata, true);

            if (is_array($metadata)) {
                $metadata['landscape_url'] = '/images/hero/hero-slideshow-19-mountain-valley.jpg';
                $metadata['closing_image_url'] = '/images/hero/hero-slideshow-20-siargao-lagoon.jpg';

                DB::table('pages')
                    ->where('slug', 'about')
                    ->update([
                        'metadata' => json_encode($metadata),
                        'updated_at' => now(),
                    ]);
            }
        }
    }

    public function down(): void
    {
        // No-op — keep current slideshow assets.
    }
};
