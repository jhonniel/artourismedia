<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private const WRONG = 'https://infosoft-playground.sgp1.digitaloceanspaces.com';

    private const RIGHT = 'https://infosoft.sgp1.digitaloceanspaces.com';

    public function up(): void
    {
        $this->replaceColumn('site_settings', 'value');
        $this->replaceColumn('services', 'image_url');
        $this->replaceColumn('projects', 'cover_image_url');
        $this->replaceColumn('posts', 'featured_image_url');
        $this->replaceColumn('homepage_sections', 'content', isJson: true);
        $this->replaceColumn('pages', 'metadata', isJson: true);

        if (Schema::hasTable('seo_settings')) {
            $this->replaceColumn('seo_settings', 'og_image_url');
        }
    }

    public function down(): void
    {
        // No-op — do not restore incorrect playground URLs.
    }

    private function replaceColumn(string $table, string $column, bool $isJson = false): void
    {
        if (! Schema::hasTable($table) || ! Schema::hasColumn($table, $column)) {
            return;
        }

        $driver = Schema::getConnection()->getDriverName();
        $wrong = self::WRONG;
        $right = self::RIGHT;

        if ($isJson && $driver === 'pgsql') {
            DB::table($table)
                ->whereRaw("{$column}::text LIKE ?", ['%infosoft-playground%'])
                ->update([
                    $column => DB::raw("replace({$column}::text, '{$wrong}', '{$right}')::json"),
                ]);

            return;
        }

        DB::table($table)
            ->where($column, 'like', '%infosoft-playground%')
            ->update([
                $column => DB::raw("replace({$column}, '{$wrong}', '{$right}')"),
            ]);
    }
};
