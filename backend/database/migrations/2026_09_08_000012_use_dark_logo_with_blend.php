<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('site_settings')
            ->where('key', 'logo_url')
            ->update([
                'value' => '/images/brand/artourismedia-logo-dark.png',
                'updated_at' => now(),
            ]);
    }

    public function down(): void
    {
        DB::table('site_settings')
            ->where('key', 'logo_url')
            ->update([
                'value' => '/images/brand/artourismedia-logo.png',
                'updated_at' => now(),
            ]);
    }
};
