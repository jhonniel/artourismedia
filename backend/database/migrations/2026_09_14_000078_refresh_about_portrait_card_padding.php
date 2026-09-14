<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private const PORTRAIT = '/images/about/art-boncato-portrait-card.png?v=2';

    public function up(): void
    {
        $page = DB::table('pages')->where('slug', 'about')->first();

        if (! $page || empty($page->metadata)) {
            return;
        }

        $metadata = json_decode($page->metadata, true);

        if (! is_array($metadata)) {
            return;
        }

        $metadata['portrait_url'] = self::PORTRAIT;

        DB::table('pages')
            ->where('slug', 'about')
            ->update([
                'metadata' => json_encode($metadata),
                'updated_at' => now(),
            ]);
    }

    public function down(): void
    {
        $page = DB::table('pages')->where('slug', 'about')->first();

        if (! $page || empty($page->metadata)) {
            return;
        }

        $metadata = json_decode($page->metadata, true);

        if (! is_array($metadata)) {
            return;
        }

        $metadata['portrait_url'] = '/images/about/art-boncato-portrait-card.png?v=1';

        DB::table('pages')
            ->where('slug', 'about')
            ->update([
                'metadata' => json_encode($metadata),
                'updated_at' => now(),
            ]);
    }
};
