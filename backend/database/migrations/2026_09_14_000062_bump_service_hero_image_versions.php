<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private const UPDATED_SLUGS = [
        'destination-branding-marketing',
        'mice-management',
        'thought-leadership-learning-development',
        'mindanao-connect',
    ];

    public function up(): void
    {
        foreach (self::UPDATED_SLUGS as $slug) {
            DB::table('services')
                ->where('slug', $slug)
                ->update([
                    'image_url' => "/images/services/{$slug}.jpg?v=2",
                    'updated_at' => now(),
                ]);
        }
    }

    public function down(): void
    {
        foreach (self::UPDATED_SLUGS as $slug) {
            DB::table('services')
                ->where('slug', $slug)
                ->update([
                    'image_url' => "/images/services/{$slug}.jpg?v=1",
                    'updated_at' => now(),
                ]);
        }
    }
};
