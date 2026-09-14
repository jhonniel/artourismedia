<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /** Homepage teaser keeps the standard portrait; identity card is /about only. */
    private const HOMEPAGE_PORTRAIT = '/images/about/art-boncato-portrait.png?v=17';

    public function up(): void
    {
        $aboutSection = DB::table('homepage_sections')->where('type', 'about')->first();

        if ($aboutSection && ! empty($aboutSection->content)) {
            $content = json_decode($aboutSection->content, true);

            if (is_array($content)) {
                $content['image_url'] = self::HOMEPAGE_PORTRAIT;

                DB::table('homepage_sections')
                    ->where('id', $aboutSection->id)
                    ->update([
                        'content' => json_encode($content),
                        'updated_at' => now(),
                    ]);
            }
        }
    }

    public function down(): void
    {
        $portraitPath = '/images/about/art-boncato-portrait-card.png?v=1';

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
    }
};
