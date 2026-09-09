<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('pages')
            ->where('slug', 'about')
            ->update([
                'metadata' => null,
                'updated_at' => now(),
            ]);
    }

    public function down(): void
    {
        DB::table('pages')
            ->where('slug', 'about')
            ->update([
                'metadata' => json_encode([
                    'values' => [
                        [
                            'title' => 'Purpose-Led Strategy',
                            'description' => 'We align tourism growth with community priorities, environmental stewardship, and long-term destination health.',
                            'icon' => 'target',
                        ],
                        [
                            'title' => 'Collaborative Design',
                            'description' => 'We co-create with local stakeholders so every brand, experience, and campaign reflects authentic place identity.',
                            'icon' => 'handshake',
                        ],
                        [
                            'title' => 'Measurable Impact',
                            'description' => 'We track visitor sentiment, economic outcomes, and campaign performance to prove what works.',
                            'icon' => 'chart-line',
                        ],
                    ],
                    'timeline' => [
                        [
                            'year' => '1992',
                            'title' => 'Founded in Manila',
                            'description' => 'Destination Studio began as a boutique consultancy serving emerging Philippine destinations.',
                        ],
                        [
                            'year' => '2008',
                            'title' => 'Regional expansion',
                            'description' => 'Our team grew across ASEAN, partnering with provincial governments and hospitality groups.',
                        ],
                        [
                            'year' => '2020',
                            'title' => 'Digital-first storytelling',
                            'description' => 'We launched integrated content and campaign services for post-pandemic recovery.',
                        ],
                        [
                            'year' => 'Today',
                            'title' => 'Nation-building partners',
                            'description' => 'We continue to help destinations become places people remember and return to.',
                        ],
                    ],
                    'team' => [
                        [
                            'name' => 'Maria Santos',
                            'role' => 'Managing Director',
                            'bio' => 'Twenty-five years leading destination master plans across Luzon, Visayas, and Mindanao.',
                            'avatar_url' => null,
                        ],
                        [
                            'name' => 'James Rivera',
                            'role' => 'Head of Strategy',
                            'bio' => 'Former tourism board advisor specializing in visitor experience and stakeholder engagement.',
                            'avatar_url' => null,
                        ],
                        [
                            'name' => 'Elena Cruz',
                            'role' => 'Creative Director',
                            'bio' => 'Award-winning brand strategist for heritage cities and coastal destination campaigns.',
                            'avatar_url' => null,
                        ],
                    ],
                ]),
                'updated_at' => now(),
            ]);
    }
};
