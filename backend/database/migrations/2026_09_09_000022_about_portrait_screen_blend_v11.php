<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
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

        $metadata['portrait_url'] = '/images/about/art-boncato-portrait.jpg?v=11';

        DB::table('pages')
            ->where('slug', 'about')
            ->update([
                'metadata' => json_encode($metadata),
                'updated_at' => now(),
            ]);
    }

    public function down(): void
    {
        // No-op.
    }
};
