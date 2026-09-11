<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        $categoryId = DB::table('project_categories')->where('slug', 'island-destinations')->value('id');

        $existing = DB::table('projects')->where('slug', 'clean-camiguin-pivot-transformation')->first();

        $payload = [
            'project_category_id' => $categoryId,
            'title' => 'Clean Camiguin Pivot and Transformation: A Post-Pandemic Strategic Development Plan',
            'excerpt' => 'A strategic framework developed to guide Camiguin\'s tourism sector through post-pandemic recovery and transformation. The plan provided a platform for repositioning the province, strengthening destination readiness and pursuing a more competitive, sustainable and resilient tourism economy.',
            'content' => '<p>A strategic framework developed to guide Camiguin\'s tourism sector through post-pandemic recovery and transformation. The plan provided a platform for repositioning the province, strengthening destination readiness and pursuing a more competitive, sustainable and resilient tourism economy.</p>',
            'cover_image_url' => '/images/projects/clean-camiguin.png',
            'category_label' => 'Strategy & Planning',
            'is_featured' => true,
            'is_published' => true,
            'sort_order' => 1,
            'color' => '#078C95',
            'updated_at' => now(),
        ];

        if ($existing) {
            DB::table('projects')
                ->where('id', $existing->id)
                ->update($payload);

            return;
        }

        DB::table('projects')->insert(array_merge($payload, [
            'uuid' => (string) Str::uuid(),
            'slug' => 'clean-camiguin-pivot-transformation',
            'created_at' => now(),
        ]));

        DB::table('projects')
            ->where('slug', 'camiguin-tourism-master-plan')
            ->update(['sort_order' => 2, 'updated_at' => now()]);

        DB::table('projects')
            ->where('slug', 'provincial-destination-branding')
            ->update(['sort_order' => 3, 'updated_at' => now()]);

        DB::table('projects')
            ->where('slug', 'international-promotion-campaign')
            ->update(['sort_order' => 4, 'updated_at' => now()]);
    }

    public function down(): void
    {
        DB::table('projects')->where('slug', 'clean-camiguin-pivot-transformation')->delete();
    }
};
