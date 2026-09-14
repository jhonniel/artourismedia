<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('settings')) {
            return;
        }

        $year = (string) date('Y');
        $setting = DB::table('settings')->where('key', 'footer_copyright')->first();

        if (! $setting) {
            return;
        }

        $value = (string) $setting->value;

        if (preg_match('/^©\s*\d{4}/', $value)) {
            $value = preg_replace('/^©\s*\d{4}/', "© {$year}", $value);
        } elseif (preg_match('/^©\s?/', $value)) {
            $value = preg_replace('/^©\s?/', "© {$year} ", $value);
        } else {
            $value = "© {$year} {$value}";
        }

        DB::table('settings')->where('key', 'footer_copyright')->update(['value' => $value]);
    }

    public function down(): void
    {
        // Year is injected dynamically in the frontend; no rollback needed.
    }
};
