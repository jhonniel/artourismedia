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
            'title' => 'Mounts Timpoong and Hibok-Hibok Ecotourism Management and Investment Plan',
            'excerpt' => 'An integrated ecotourism framework for the sustainable development and management of the Mounts Timpoong–Hibok-Hibok landscape. The engagement combined conservation, visitor experience, community participation, site management and investment planning to support responsible tourism within an environmentally sensitive destination.',
            'content' => '<p>An integrated ecotourism framework for the sustainable development and management of the Mounts Timpoong–Hibok-Hibok landscape. The engagement combined conservation, visitor experience, community participation, site management and investment planning to support responsible tourism within an environmentally sensitive destination.</p>',
            'cover_image_url' => '/images/projects/mounts-timpoong-hibok-hibok.png',
            'category_label' => 'Ecotourism & Conservation',
            'is_featured' => true,
            'is_published' => true,
            'sort_order' => 3,
            'color' => '#078C95',
            'updated_at' => now(),
        ];

        $existing = DB::table('projects')->where('slug', 'mounts-timpoong-hibok-hibok-ecotourism-plan')->first();

        if ($existing) {
            DB::table('projects')->where('id', $existing->id)->update($payload);

            return;
        }

        DB::table('projects')->insert(array_merge($payload, [
            'uuid' => (string) Str::uuid(),
            'slug' => 'mounts-timpoong-hibok-hibok-ecotourism-plan',
            'created_at' => now(),
        ]));
    }

    public function down(): void
    {
        DB::table('projects')->where('slug', 'mounts-timpoong-hibok-hibok-ecotourism-plan')->delete();
    }
};
