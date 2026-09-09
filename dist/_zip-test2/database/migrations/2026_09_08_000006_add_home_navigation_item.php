<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        $home = DB::table('navigation_items')
            ->where('label', 'Home')
            ->whereNull('deleted_at')
            ->first();

        if ($home) {
            DB::table('navigation_items')
                ->where('id', $home->id)
                ->update([
                    'url' => '/',
                    'target' => '_self',
                    'is_active' => true,
                    'is_cta' => false,
                    'sort_order' => 1,
                    'updated_at' => now(),
                ]);
        } else {
            DB::table('navigation_items')->insert([
                'uuid' => (string) Str::uuid(),
                'label' => 'Home',
                'url' => '/',
                'target' => '_self',
                'is_active' => true,
                'is_cta' => false,
                'sort_order' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $order = [
            'About' => 2,
            'Services' => 3,
            'Projects' => 4,
            'Insights' => 5,
            'Schedule a Consultation' => 6,
        ];

        foreach ($order as $label => $sortOrder) {
            DB::table('navigation_items')
                ->where('label', $label)
                ->whereNull('deleted_at')
                ->update([
                    'sort_order' => $sortOrder,
                    'updated_at' => now(),
                ]);
        }
    }

    public function down(): void
    {
        DB::table('navigation_items')
            ->where('label', 'Home')
            ->whereNull('deleted_at')
            ->update([
                'is_active' => false,
                'updated_at' => now(),
            ]);

        $order = [
            'About' => 1,
            'Services' => 2,
            'Projects' => 3,
            'Insights' => 4,
            'Schedule a Consultation' => 5,
        ];

        foreach ($order as $label => $sortOrder) {
            DB::table('navigation_items')
                ->where('label', $label)
                ->whereNull('deleted_at')
                ->update([
                    'sort_order' => $sortOrder,
                    'updated_at' => now(),
                ]);
        }
    }
};
