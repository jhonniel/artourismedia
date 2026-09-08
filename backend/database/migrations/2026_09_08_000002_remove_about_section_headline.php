<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $this->updateAboutSection(function (array $content): array {
            unset($content['title'], $content['title_accent']);

            return $content;
        });
    }

    public function down(): void
    {
        $this->updateAboutSection(function (array $content): array {
            $content['title'] = 'Experience. Insight.';
            $content['title_accent'] = 'Commitment.';

            return $content;
        });
    }

    /**
     * @param  callable(array<string, mixed>): array<string, mixed>  $mutator
     */
    protected function updateAboutSection(callable $mutator): void
    {
        $sections = DB::table('homepage_sections')
            ->where('type', 'about')
            ->get();

        foreach ($sections as $section) {
            $content = json_decode($section->content ?? '{}', true);

            if (! is_array($content)) {
                continue;
            }

            DB::table('homepage_sections')
                ->where('id', $section->id)
                ->update([
                    'content' => json_encode($mutator($content)),
                    'updated_at' => now(),
                ]);
        }
    }
};
