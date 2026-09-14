<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('services')
            ->where('slug', 'destination-branding-marketing')
            ->update([
                'image_url' => '/images/services/destination-branding-marketing.jpg?v=1',
                'updated_at' => now(),
            ]);
    }

    public function down(): void
    {
        DB::table('services')
            ->where('slug', 'destination-branding-marketing')
            ->update([
                'image_url' => '/images/services/destination-branding-marketing.png',
                'updated_at' => now(),
            ]);
    }
};
