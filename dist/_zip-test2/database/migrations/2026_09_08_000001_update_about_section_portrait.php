<?php

use App\Support\Assets;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $sections = DB::table('homepage_sections')
            ->where('type', 'about')
            ->get();

        foreach ($sections as $section) {
            $content = json_decode($section->content ?? '{}', true);

            if (! is_array($content)) {
                continue;
            }

            $content['image_url'] = Assets::url('/images/about/art-boncato-portrait.jpg');
            $content['image_alt'] = 'Art Boncato professional portrait';

            DB::table('homepage_sections')
                ->where('id', $section->id)
                ->update([
                    'content' => json_encode($content),
                    'updated_at' => now(),
                ]);
        }
    }

    public function down(): void
    {
        $sections = DB::table('homepage_sections')
            ->where('type', 'about')
            ->get();

        foreach ($sections as $section) {
            $content = json_decode($section->content ?? '{}', true);

            if (! is_array($content)) {
                continue;
            }

            $content['image_url'] = Assets::url('/images/about/about-professional-chair.jpg');
            $content['image_alt'] = 'Art Boncato professional portrait in office';

            DB::table('homepage_sections')
                ->where('id', $section->id)
                ->update([
                    'content' => json_encode($content),
                    'updated_at' => now(),
                ]);
        }
    }
};
