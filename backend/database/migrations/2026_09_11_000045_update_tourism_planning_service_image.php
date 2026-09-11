<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('services')
            ->where('slug', 'tourism-planning-development')
            ->update([
                'image_url' => '/images/services/tourism-planning-development.jpg?v=4',
                'updated_at' => now(),
            ]);
    }

    public function down(): void
    {
        DB::table('services')
            ->where('slug', 'tourism-planning-development')
            ->update([
                'image_url' => '/images/services/tourism-planning-development.png',
                'updated_at' => now(),
            ]);
    }
};
