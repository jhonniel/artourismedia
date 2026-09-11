<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $portraitPath = '/images/about/art-boncato-portrait.jpg?v=14';

        $aboutSection = DB::table('homepage_sections')->where('type', 'about')->first();

        if ($aboutSection && ! empty($aboutSection->content)) {
            $content = json_decode($aboutSection->content, true);

            if (is_array($content)) {
                $content['image_url'] = $portraitPath;

                DB::table('homepage_sections')
                    ->where('id', $aboutSection->id)
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
                $metadata['portrait_url'] = $portraitPath;

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
        $portraitPath = '/images/about/art-boncato-portrait.png?v=13';

        $aboutSection = DB::table('homepage_sections')->where('type', 'about')->first();

        if ($aboutSection && ! empty($aboutSection->content)) {
            $content = json_decode($aboutSection->content, true);

            if (is_array($content)) {
                $content['image_url'] = $portraitPath;

                DB::table('homepage_sections')
                    ->where('id', $aboutSection->id)
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
                $metadata['portrait_url'] = $portraitPath;

                DB::table('pages')
                    ->where('slug', 'about')
                    ->update([
                        'metadata' => json_encode($metadata),
                        'updated_at' => now(),
                    ]);
            }
        }
    }
};
