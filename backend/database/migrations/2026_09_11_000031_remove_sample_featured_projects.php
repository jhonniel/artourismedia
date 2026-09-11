<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /** @var list<string> */
    private const SAMPLE_SLUGS = [
        'camiguin-tourism-master-plan',
        'provincial-destination-branding',
        'international-promotion-campaign',
    ];

    public function up(): void
    {
        DB::table('projects')->whereIn('slug', self::SAMPLE_SLUGS)->delete();
    }

    public function down(): void
    {
        // Sample projects removed intentionally.
    }
};
