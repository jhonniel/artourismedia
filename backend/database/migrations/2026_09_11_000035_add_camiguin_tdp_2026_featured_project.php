<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        $categoryId = DB::table('project_categories')->where('slug', 'island-destinations')->value('id');

        $payload = [
            'project_category_id' => $categoryId,
            'title' => 'Camiguin Tourism Development Action Plan 2026–2028',
            'excerpt' => 'A results-oriented action plan that translates Camiguin\'s tourism vision into coordinated programs, projects, implementation responsibilities and investment priorities. It provides a practical roadmap for government, tourism enterprises, communities and development partners to advance the province\'s tourism goals over the three-year period.',
            'content' => '<p>A results-oriented action plan that translates Camiguin\'s tourism vision into coordinated programs, projects, implementation responsibilities and investment priorities. It provides a practical roadmap for government, tourism enterprises, communities and development partners to advance the province\'s tourism goals over the three-year period.</p>',
            'cover_image_url' => '/images/projects/camiguin-sunken-cemetery.jpg',
            'category_label' => 'Strategy & Planning',
            'is_featured' => true,
            'is_published' => true,
            'sort_order' => 5,
            'color' => '#078C95',
            'updated_at' => now(),
        ];

        $existing = DB::table('projects')->where('slug', 'camiguin-tourism-development-action-plan-2026-2028')->first();

        if ($existing) {
            DB::table('projects')->where('id', $existing->id)->update($payload);

            return;
        }

        DB::table('projects')->insert(array_merge($payload, [
            'uuid' => (string) Str::uuid(),
            'slug' => 'camiguin-tourism-development-action-plan-2026-2028',
            'created_at' => now(),
        ]));
    }

    public function down(): void
    {
        DB::table('projects')->where('slug', 'camiguin-tourism-development-action-plan-2026-2028')->delete();
    }
};
