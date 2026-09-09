<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('site_settings')
            ->where('key', 'favicon_url')
            ->update([
                'value' => '/favicon.png',
            ]);
    }

    public function down(): void
    {
        DB::table('site_settings')
            ->where('key', 'favicon_url')
            ->update([
                'value' => '/favicon.svg',
            ]);
    }
};
