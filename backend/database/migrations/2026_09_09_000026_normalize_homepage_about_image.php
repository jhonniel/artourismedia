<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $section = DB::table('homepage_sections')->where('type', 'about')->first();

        if (! $section || empty($section->content)) {
            return;
        }

        $content = json_decode($section->content, true);

        if (! is_array($content)) {
            return;
        }

        $content['image_url'] = '/images/about/art-boncato-portrait.png';
        $content['image_alt'] = $content['image_alt'] ?? 'Art Boncato, Jr.';

        DB::table('homepage_sections')
            ->where('id', $section->id)
            ->update([
                'content' => json_encode($content),
                'updated_at' => now(),
            ]);
    }

    public function down(): void
    {
        // No-op — keep relative asset paths.
    }
};
