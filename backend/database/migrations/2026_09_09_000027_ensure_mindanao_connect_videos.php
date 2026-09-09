<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        $service = DB::table('services')->where('slug', 'mindanao-connect')->first();

        if (! $service) {
            return;
        }

        $count = DB::table('service_videos')
            ->where('service_id', $service->id)
            ->whereNull('deleted_at')
            ->count();

        if ($count > 0) {
            return;
        }

        DB::table('service_videos')->insert([
            'uuid' => (string) Str::uuid(),
            'service_id' => $service->id,
            'youtube_url' => 'https://www.youtube.com/watch?v=hPBoDRcv-5U',
            'youtube_id' => 'hPBoDRcv-5U',
            'title' => 'Mindanao Roadtrip with Art',
            'description' => 'Featured video from the Mindanao CONNECT series.',
            'view_count' => 0,
            'published_at' => null,
            'is_active' => true,
            'sort_order' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        // No-op — do not remove seeded fallback videos.
    }
};
