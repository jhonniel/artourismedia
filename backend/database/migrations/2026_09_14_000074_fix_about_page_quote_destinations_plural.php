<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private const QUOTE = 'Sustainable tourism is the name of our game in the strategic of our Philippine destinations';

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

        $metadata['quote'] = self::QUOTE;

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

        $metadata['quote'] = 'Sustainable tourism is the name of our game in the strategic of our Philippine destination';

        DB::table('pages')
            ->where('slug', 'about')
            ->update([
                'metadata' => json_encode($metadata),
                'updated_at' => now(),
            ]);
    }
};
