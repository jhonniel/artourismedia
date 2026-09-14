<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('services')
            ->where('slug', 'mindanao-connect')
            ->update([
                'image_url' => '/images/services/mindanao-connect.jpg?v=1',
                'updated_at' => now(),
            ]);
    }

    public function down(): void
    {
        DB::table('services')
            ->where('slug', 'mindanao-connect')
            ->update([
                'image_url' => '/images/services/mindanao-connect.png',
                'updated_at' => now(),
            ]);
    }
};
