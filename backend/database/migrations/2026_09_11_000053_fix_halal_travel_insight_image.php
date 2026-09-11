<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('posts')
            ->where('slug', 'philippines-rising-muslim-friendly-destination-halal-travel-summit')
            ->update([
                'featured_image_url' => '/images/services/tourism-planning-development.jpg?v=4',
                'updated_at' => now(),
            ]);
    }

    public function down(): void
    {
        DB::table('posts')
            ->where('slug', 'philippines-rising-muslim-friendly-destination-halal-travel-summit')
            ->update([
                'featured_image_url' => '/images/services/mice-management.png',
                'updated_at' => now(),
            ]);
    }
};
