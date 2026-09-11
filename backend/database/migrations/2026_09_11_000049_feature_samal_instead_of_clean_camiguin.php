<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('projects')
            ->where('slug', 'clean-camiguin-pivot-transformation')
            ->update([
                'is_featured' => false,
                'sort_order' => 6,
                'updated_at' => now(),
            ]);

        DB::table('projects')
            ->where('slug', 'samal-strategic-action-plan')
            ->update([
                'is_featured' => true,
                'sort_order' => 1,
                'updated_at' => now(),
            ]);
    }

    public function down(): void
    {
        DB::table('projects')
            ->where('slug', 'clean-camiguin-pivot-transformation')
            ->update([
                'is_featured' => true,
                'sort_order' => 1,
                'updated_at' => now(),
            ]);

        DB::table('projects')
            ->where('slug', 'samal-strategic-action-plan')
            ->update([
                'is_featured' => true,
                'sort_order' => 4,
                'updated_at' => now(),
            ]);
    }
};
