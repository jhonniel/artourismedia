<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private const CONTENT = <<<'HTML'
<p>We are guided by the Visitor, Industry, Community and Environment (VICE) framework, from the research process right through to every practical action on the ground.</p><h3>Projects and Experience:</h3><ul><li>Camiguin Tourism Development Plan 2025-2028</li><li>Mts. Timpoong- Hibok-Hibok National Monument (MTHNM) Ecotourism and Management Plan 2022</li><li>Island Garden City of Samal (IGACOS) Tourism Plans Review 2022</li><li>Mantigue Island Tourism Management Plan 2021</li><li>Camiguin Pivot and Transformation : A Tourism Recovery Plan 2021-2023</li><li>Implementing the Siargao Tourism Master Plan (STMP): Action Plan Recommendations 2021</li></ul>
HTML;

    public function up(): void
    {
        DB::table('services')
            ->where('slug', 'tourism-planning-development')
            ->update([
                'content' => self::CONTENT,
                'updated_at' => now(),
            ]);
    }

    public function down(): void
    {
        DB::table('services')
            ->where('slug', 'tourism-planning-development')
            ->update([
                'content' => '<p>We are guided by the Visitor, Industry, Community and Environment (VICE) framework, from the research process right through to every practical action on the ground.</p><h3>Projects and Experience:</h3><ul><li>Camiguin Tourism Development Plan 2025-2028</li><li>Mts. Timpoong- Hibok-Hibok National Monument (MTHNM) Ecotourism and Management Plan 2022</li><li>Island Garden City of Samal (IGACOS) Tourism Plans Review 2022</li><li>Camiguin Pivot and Transformation : A Tourism Recovery Plan 2021-2023</li><li>Mantigue Island Tourism Management Plan 2021</li><li>Implementing the Siargao Tourism Master Plan (STMP): Action Plan Recommendations 2021</li></ul>',
                'updated_at' => now(),
            ]);
    }
};
