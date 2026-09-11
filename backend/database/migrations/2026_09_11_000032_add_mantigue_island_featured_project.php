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
            'title' => 'Mantigue Island Tourism Management Plan',
            'excerpt' => 'A destination-level management plan designed to balance visitor experience, environmental protection and community benefits. It established actionable measures for visitor management, carrying capacity, tourism facilities, product enhancement, safety and service standards, stakeholder participation and the long-term protection of Mantigue Island\'s natural resources.',
            'content' => '<p>A destination-level management plan designed to balance visitor experience, environmental protection and community benefits. It established actionable measures for visitor management, carrying capacity, tourism facilities, product enhancement, safety and service standards, stakeholder participation and the long-term protection of Mantigue Island\'s natural resources.</p>',
            'cover_image_url' => '/images/projects/mantigue-island.jpg',
            'category_label' => 'Destination Management',
            'is_featured' => true,
            'is_published' => true,
            'sort_order' => 2,
            'color' => '#078C95',
            'updated_at' => now(),
        ];

        $existing = DB::table('projects')->where('slug', 'mantigue-island-tourism-management-plan')->first();

        if ($existing) {
            DB::table('projects')->where('id', $existing->id)->update($payload);

            return;
        }

        DB::table('projects')->insert(array_merge($payload, [
            'uuid' => (string) Str::uuid(),
            'slug' => 'mantigue-island-tourism-management-plan',
            'created_at' => now(),
        ]));
    }

    public function down(): void
    {
        DB::table('projects')->where('slug', 'mantigue-island-tourism-management-plan')->delete();
    }
};
