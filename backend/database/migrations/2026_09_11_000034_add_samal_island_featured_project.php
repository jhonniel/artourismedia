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
            'title' => 'Reformulated Island Garden City of Samal Strategic Action Plan',
            'excerpt' => 'An updated strategic action plan responsive to changing tourism conditions, emerging market opportunities and evolving destination-management requirements. The plan identified priority interventions for strengthening Samal\'s tourism competitiveness while protecting the island\'s environmental resources and promoting benefits for its communities and tourism enterprises.',
            'content' => '<p>An updated strategic action plan responsive to changing tourism conditions, emerging market opportunities and evolving destination-management requirements. The plan identified priority interventions for strengthening Samal\'s tourism competitiveness while protecting the island\'s environmental resources and promoting benefits for its communities and tourism enterprises.</p>',
            'cover_image_url' => '/images/projects/samal-island.jpg',
            'category_label' => 'Strategy & Planning',
            'is_featured' => true,
            'is_published' => true,
            'sort_order' => 4,
            'color' => '#078C95',
            'updated_at' => now(),
        ];

        $existing = DB::table('projects')->where('slug', 'samal-strategic-action-plan')->first();

        if ($existing) {
            DB::table('projects')->where('id', $existing->id)->update($payload);

            return;
        }

        DB::table('projects')->insert(array_merge($payload, [
            'uuid' => (string) Str::uuid(),
            'slug' => 'samal-strategic-action-plan',
            'created_at' => now(),
        ]));
    }

    public function down(): void
    {
        DB::table('projects')->where('slug', 'samal-strategic-action-plan')->delete();
    }
};
