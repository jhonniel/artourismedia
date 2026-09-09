<?php

use App\Support\Assets;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        $this->setSetting('logo_url', Assets::url('/images/brand/artourismedia-logo.png'));
        $this->setSetting('site_name', 'ArTourisMedia');
        $this->setSetting('site_tagline', 'Tourism Consultancy');
        $this->setSetting('tagline', 'Tourism Consultancy');
    }

    public function down(): void
    {
        $this->setSetting('logo_url', Assets::url('/images/brand/logo-header-v2.png'));
        $this->setSetting('site_name', 'Art!');
        $this->setSetting('site_tagline', 'Boncato Tourism Consultancy');
        $this->setSetting('tagline', 'Boncato Tourism Consultancy');
    }

    protected function setSetting(string $key, string $value): void
    {
        $existing = DB::table('site_settings')->where('key', $key)->first();

        if ($existing) {
            DB::table('site_settings')->where('key', $key)->update([
                'value' => $value,
                'updated_at' => now(),
            ]);

            return;
        }

        DB::table('site_settings')->insert([
            'uuid' => (string) Str::uuid(),
            'key' => $key,
            'value' => $value,
            'type' => 'string',
            'group' => $key === 'logo_url' ? 'branding' : 'general',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
};
