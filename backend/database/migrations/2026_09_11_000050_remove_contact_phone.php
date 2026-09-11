<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('site_settings')
            ->whereIn('key', ['contact_phone', 'footer_phone'])
            ->update([
                'value' => '',
                'updated_at' => now(),
            ]);
    }

    public function down(): void
    {
        DB::table('site_settings')->where('key', 'contact_phone')->update([
            'value' => '+63 917 123 4567',
            'updated_at' => now(),
        ]);

        DB::table('site_settings')->where('key', 'footer_phone')->update([
            'value' => '+63 917 123 4567',
            'updated_at' => now(),
        ]);
    }
};
