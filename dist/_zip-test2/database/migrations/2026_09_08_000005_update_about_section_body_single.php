<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $this->updateAboutBody(
            '<p>For over 30 years, Art Boncato has shaped tourism and hospitality through strategic leadership, destination development, and national tourism initiatives—driving sustainable growth and creating opportunities for communities across the Philippines, especially Mindanao.</p>'
        );
    }

    public function down(): void
    {
        $this->updateAboutBody(
            '<p>Art Boncato, Jr. is a tourism and hospitality executive who continues to build on a career spanning 30 years.</p>'
            .'<p>For over 30 years, Art Boncato has shaped tourism and hospitality through strategic leadership, destination development, and national tourism initiatives—driving sustainable growth and creating opportunities for communities across the Philippines, especially Mindanao.</p>'
        );
    }

    protected function updateAboutBody(string $body): void
    {
        $sections = DB::table('homepage_sections')
            ->where('type', 'about')
            ->get();

        foreach ($sections as $section) {
            $content = json_decode($section->content ?? '{}', true);

            if (! is_array($content)) {
                continue;
            }

            $content['body'] = $body;

            DB::table('homepage_sections')
                ->where('id', $section->id)
                ->update([
                    'content' => json_encode($content),
                    'updated_at' => now(),
                ]);
        }
    }
};
