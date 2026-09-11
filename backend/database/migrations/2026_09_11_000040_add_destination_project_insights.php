<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        $authorId = DB::table('users')->orderBy('id')->value('id');
        $strategyCategoryId = DB::table('post_categories')->where('slug', 'strategy')->value('id');

        if (! $authorId || ! $strategyCategoryId) {
            return;
        }

        $posts = [
            [
                'slug' => 'camiguin-tourism-development-plan-2026-2028',
                'title' => 'Camiguin\'s 2026–2028 Tourism Roadmap Takes Shape',
                'excerpt' => 'A results-oriented action plan translates Camiguin\'s tourism vision into coordinated programs, implementation responsibilities and investment priorities for the next three years.',
                'content' => '<p>Camiguin is moving from broad vision to coordinated action. The province\'s Tourism Development Action Plan 2026–2028 sets out practical programs, implementation roles and investment priorities for government, tourism enterprises, communities and development partners.</p><p>It builds on recent planning work across the island and gives stakeholders a shared roadmap for strengthening competitiveness while protecting Camiguin\'s natural and cultural assets.</p><p><a href="/projects/camiguin-tourism-development-action-plan-2026-2028">View the Camiguin Tourism Development Action Plan 2026–2028 project</a></p>',
                'featured_image_url' => '/images/projects/camiguin-sunken-cemetery.jpg',
                'reading_time' => 5,
                'published_at' => now(),
                'seo_title' => 'Camiguin Tourism Development Action Plan 2026–2028 | Art Boncato',
                'seo_description' => 'How Camiguin\'s new tourism action plan turns vision into coordinated programs and investment priorities.',
            ],
            [
                'slug' => 'samal-island-tourism-strategic-action-plan',
                'title' => 'Samal Island Refreshes Its Tourism Strategic Action Plan',
                'excerpt' => 'An updated strategic action plan helps Samal respond to changing tourism conditions while protecting environmental resources and delivering benefits for communities and enterprises.',
                'content' => '<p>The Island Garden City of Samal has updated its strategic action plan to reflect new market opportunities, shifting visitor expectations and evolving destination-management requirements.</p><p>The reformulated plan identifies priority interventions for strengthening Samal\'s tourism competitiveness, safeguarding the island\'s environmental resources and ensuring communities and tourism enterprises share in the benefits of growth.</p><p><a href="/projects/samal-strategic-action-plan">View the Samal Strategic Action Plan project</a></p>',
                'featured_image_url' => '/images/projects/samal-island.jpg',
                'reading_time' => 6,
                'published_at' => now()->subDay(),
                'seo_title' => 'Samal Island Tourism Strategic Action Plan | Art Boncato',
                'seo_description' => 'How Samal\'s refreshed tourism strategic action plan supports competitiveness, communities and environmental protection.',
            ],
            [
                'slug' => 'clean-camiguin-post-pandemic-transformation',
                'title' => 'Clean Camiguin: Repositioning Tourism After the Pandemic',
                'excerpt' => 'A post-pandemic strategic framework guides Camiguin\'s tourism recovery through destination readiness, sustainability and a more resilient provincial tourism economy.',
                'content' => '<p>The Clean Camiguin Pivot and Transformation plan provided a strategic platform for repositioning the province after the pandemic—strengthening destination readiness, improving competitiveness and building a more sustainable tourism economy.</p><p>It connected recovery priorities with longer-term transformation goals, giving Camiguin a clearer path for government, enterprises and communities to work together.</p><p><a href="/projects/clean-camiguin-pivot-transformation">View the Clean Camiguin Pivot and Transformation project</a></p>',
                'featured_image_url' => '/images/projects/clean-camiguin.png?v=16',
                'reading_time' => 5,
                'published_at' => now()->subDays(2),
                'seo_title' => 'Clean Camiguin Post-Pandemic Tourism Transformation | Art Boncato',
                'seo_description' => 'How Camiguin\'s Clean Camiguin plan supports post-pandemic tourism recovery and transformation.',
            ],
        ];

        foreach ($posts as $post) {
            $existing = DB::table('posts')->where('slug', $post['slug'])->first();

            $payload = array_merge($post, [
                'post_category_id' => $strategyCategoryId,
                'author_id' => $authorId,
                'status' => 'published',
                'is_featured' => true,
                'allow_social_sharing' => true,
                'updated_at' => now(),
            ]);

            if ($existing) {
                DB::table('posts')->where('id', $existing->id)->update($payload);

                continue;
            }

            DB::table('posts')->insert(array_merge($payload, [
                'uuid' => (string) Str::uuid(),
                'created_at' => now(),
            ]));
        }
    }

    public function down(): void
    {
        DB::table('posts')->whereIn('slug', [
            'camiguin-tourism-development-plan-2026-2028',
            'samal-island-tourism-strategic-action-plan',
            'clean-camiguin-post-pandemic-transformation',
        ])->delete();
    }
};
