<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private const CONTENT = <<<'HTML'
<p>An updated strategic action plan responsive to changing tourism conditions, emerging market opportunities and evolving destination-management requirements. The plan identified priority interventions for strengthening Samal's tourism competitiveness while protecting the island's environmental resources and promoting benefits for its communities and tourism enterprises.</p><p>Developed through extensive research, stakeholder consultations, and data-driven analysis, this plan provides a clear roadmap to guide the island's sustainable tourism development. It outlines practical strategies and initiatives that address current market realities, leverage Samal's natural and cultural assets, and create long-term opportunities for inclusive economic growth.</p>
HTML;

    public function up(): void
    {
        DB::table('projects')
            ->where('slug', 'samal-strategic-action-plan')
            ->update([
                'content' => self::CONTENT,
                'updated_at' => now(),
            ]);
    }

    public function down(): void
    {
        DB::table('projects')
            ->where('slug', 'samal-strategic-action-plan')
            ->update([
                'content' => '<p>An updated strategic action plan responsive to changing tourism conditions, emerging market opportunities and evolving destination-management requirements. The plan identified priority interventions for strengthening Samal\'s tourism competitiveness while protecting the island\'s environmental resources and promoting benefits for its communities and tourism enterprises.</p>',
                'updated_at' => now(),
            ]);
    }
};
