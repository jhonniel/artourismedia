<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private const SLUGS = [
        'building-destination-brands-that-last',
        'power-of-storytelling-in-tourism',
    ];

    public function up(): void
    {
        $postIds = DB::table('posts')
            ->whereIn('slug', self::SLUGS)
            ->pluck('id');

        if ($postIds->isEmpty()) {
            return;
        }

        DB::table('post_tag')->whereIn('post_id', $postIds)->delete();
        DB::table('posts')->whereIn('id', $postIds)->delete();
    }

    public function down(): void
    {
        // Sample posts removed intentionally; restore via DatabaseSeeder if needed.
    }
};
