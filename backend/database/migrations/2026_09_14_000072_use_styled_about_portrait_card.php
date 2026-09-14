<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $portraitPath = '/images/about/art-boncato-portrait-card.png?v=1';

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
        $portraitPath = '/images/about/art-boncato-portrait.png?v=17';

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
