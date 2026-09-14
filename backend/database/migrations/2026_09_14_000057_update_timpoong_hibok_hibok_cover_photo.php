<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('projects')
            ->where('slug', 'mounts-timpoong-hibok-hibok-ecotourism-plan')
            ->update([
                'cover_image_url' => '/images/projects/mounts-timpoong-hibok-hibok.jpg?v=1',
                'updated_at' => now(),
            ]);
    }

    public function down(): void
    {
        DB::table('projects')
            ->where('slug', 'mounts-timpoong-hibok-hibok-ecotourism-plan')
            ->update([
                'cover_image_url' => '/images/projects/mounts-timpoong-hibok-hibok.png',
                'updated_at' => now(),
            ]);
    }
};
