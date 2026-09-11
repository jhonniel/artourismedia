<?php

use App\Support\AboutPageMetadata;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $metadata = AboutPageMetadata::defaults();

        DB::table('pages')
            ->where('slug', 'about')
            ->update([
                'content' => $metadata['career_body'],
                'metadata' => json_encode($metadata),
                'updated_at' => now(),
            ]);
    }

    public function down(): void
    {
        $page = DB::table('pages')->where('slug', 'about')->first();

        if (! $page) {
            return;
        }

        $content = str_replace(
            'Art spent the past',
            'He has spent the past',
            (string) $page->content
        );

        $metadata = json_decode($page->metadata ?? '{}', true);

        if (is_array($metadata) && isset($metadata['career_body'])) {
            $metadata['career_body'] = str_replace(
                'Art spent the past',
                'He has spent the past',
                (string) $metadata['career_body']
            );
        }

        DB::table('pages')
            ->where('slug', 'about')
            ->update([
                'content' => $content,
                'metadata' => json_encode($metadata),
                'updated_at' => now(),
            ]);
    }
};
