<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('site_settings')
            ->whereIn('key', ['contact_email', 'footer_email'])
            ->update(['value' => 'atm@artourismedia.com', 'updated_at' => now()]);
    }

    public function down(): void
    {
        DB::table('site_settings')
            ->whereIn('key', ['contact_email', 'footer_email'])
            ->update(['value' => 'hello@artourismedia.com', 'updated_at' => now()]);
    }
};
