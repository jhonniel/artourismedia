<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private const QUOTE = 'The Philippine tourism industry has to compete hard and fast with the rest of the world today and place the sustainability of host communities and business stakeholders at the heart of its efforts.';

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

        $metadata['quote'] = 'Sustainable tourism is the name of our game in the strategic of our Philippine destinations';

        DB::table('pages')
            ->where('slug', 'about')
            ->update([
                'metadata' => json_encode($metadata),
                'updated_at' => now(),
            ]);
    }
};
