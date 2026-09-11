<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $section = DB::table('homepage_sections')->where('type', 'services')->first();

        if (! $section || empty($section->content)) {
            return;
        }

        $content = json_decode($section->content, true);

        if (! is_array($content)) {
            return;
        }

        if (($content['title'] ?? '') === 'End-to-end solutions for') {
            $content['title'] = 'Offering solutions for';
        }

        DB::table('homepage_sections')
            ->where('id', $section->id)
            ->update([
                'content' => json_encode($content),
                'updated_at' => now(),
            ]);
    }

    public function down(): void
    {
        $section = DB::table('homepage_sections')->where('type', 'services')->first();

        if (! $section || empty($section->content)) {
            return;
        }

        $content = json_decode($section->content, true);

        if (! is_array($content)) {
            return;
        }

        if (($content['title'] ?? '') === 'Offering solutions for') {
            $content['title'] = 'End-to-end solutions for';
        }

        DB::table('homepage_sections')
            ->where('id', $section->id)
            ->update([
                'content' => json_encode($content),
                'updated_at' => now(),
            ]);
    }
};
