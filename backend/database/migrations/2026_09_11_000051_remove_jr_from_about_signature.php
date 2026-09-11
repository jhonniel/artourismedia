<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $page = DB::table('pages')->where('slug', 'about')->first();

        if (! $page) {
            return;
        }

        $metadata = json_decode($page->metadata ?? '{}', true);

        if (! is_array($metadata)) {
            return;
        }

        $metadata['signature_name'] = 'Art Boncato';

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

        if (! $page) {
            return;
        }

        $metadata = json_decode($page->metadata ?? '{}', true);

        if (! is_array($metadata)) {
            return;
        }

        $metadata['signature_name'] = 'Art Boncato, Jr.';

        DB::table('pages')
            ->where('slug', 'about')
            ->update([
                'metadata' => json_encode($metadata),
                'updated_at' => now(),
            ]);
    }
};
