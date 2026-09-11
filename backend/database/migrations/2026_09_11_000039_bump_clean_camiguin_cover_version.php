<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('projects')
            ->where('slug', 'clean-camiguin-pivot-transformation')
            ->update([
                'cover_image_url' => '/images/projects/clean-camiguin.png?v=16',
                'updated_at' => now(),
            ]);
    }

    public function down(): void
    {
        DB::table('projects')
            ->where('slug', 'clean-camiguin-pivot-transformation')
            ->update([
                'cover_image_url' => '/images/projects/clean-camiguin.png?v=15',
                'updated_at' => now(),
            ]);
    }
};
