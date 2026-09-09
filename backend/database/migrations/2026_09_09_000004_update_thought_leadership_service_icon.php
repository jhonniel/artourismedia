<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('services')
            ->where('slug', 'thought-leadership-learning-development')
            ->update([
                'image_url' => '/images/services/thought-leadership-learning-development.jpg',
            ]);
    }

    public function down(): void
    {
        DB::table('services')
            ->where('slug', 'thought-leadership-learning-development')
            ->update([
                'image_url' => '/images/services/tourism-planning.svg',
            ]);
    }
};
