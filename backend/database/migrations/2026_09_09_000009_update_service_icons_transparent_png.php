<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    protected function iconPaths(): array
    {
        return [
            'tourism-planning-development' => '/images/services/tourism-planning-development.png',
            'destination-branding-marketing' => '/images/services/destination-branding-marketing.png',
            'mice-management' => '/images/services/mice-management.png',
            'thought-leadership-learning-development' => '/images/services/thought-leadership-learning-development.png',
            'mindanao-connect' => '/images/services/mindanao-connect.png',
        ];
    }

    public function up(): void
    {
        foreach ($this->iconPaths() as $slug => $path) {
            DB::table('services')
                ->where('slug', $slug)
                ->update([
                    'image_url' => $path,
                    'updated_at' => now(),
                ]);
        }
    }

    public function down(): void
    {
        foreach ($this->iconPaths() as $slug => $path) {
            DB::table('services')
                ->where('slug', $slug)
                ->update([
                    'image_url' => str_replace('.png', '.jpg', $path),
                    'updated_at' => now(),
                ]);
        }
    }
};
