<?php

namespace Database\Seeders;

use App\Models\HomepageSection;
use App\Support\Assets;
use App\Support\AboutPageMetadata;
use App\Support\LegalPageContent;
use App\Models\NavigationItem;
use App\Models\NewsletterSubscriber;
use App\Models\Page;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\Project;
use App\Models\ProjectCategory;
use App\Models\SeoSetting;
use App\Models\Service;
use App\Models\ServiceVideo;
use App\Models\SiteSetting;
use App\Services\MindanaoConnectVideoImportService;
use App\Models\SocialLink;
use App\Models\Statistic;
use App\Models\Tag;
use App\Models\TrustStripItem;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::query()->updateOrCreate(
            ['email' => env('ADMIN_EMAIL', 'admin@destinationstudio.test')],
            [
                'name' => 'Destination Studio Admin',
                'password' => Hash::make(env('ADMIN_PASSWORD', 'password')),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        User::query()->updateOrCreate(
            ['email' => 'editor@destinationstudio.test'],
            [
                'name' => 'Content Editor',
                'password' => Hash::make('password'),
                'role' => 'editor',
                'email_verified_at' => now(),
            ]
        );

        User::query()->updateOrCreate(
            ['email' => 'author@destinationstudio.test'],
            [
                'name' => 'Blog Author',
                'password' => Hash::make('password'),
                'role' => 'author',
                'email_verified_at' => now(),
            ]
        );

        $this->seedSiteSettings();
        $this->seedNavigation();
        $this->seedHomepageSections();
        $this->seedTrustStrip();
        $this->seedStatistics();
        $this->seedSocialLinks();
        $this->seedServices();
        $this->seedMindanaoConnectVideos();
        $this->seedProjectCategoriesAndProjects();
        $this->seedPostCategoriesTagsAndPosts($admin);
        $this->seedPages();
        $this->seedSeoSettings();
        $this->seedNewsletterSubscribers();
    }

    protected function seedSiteSettings(): void
    {
        $settings = [
            ['key' => 'site_name', 'value' => 'ArTourisMedia', 'type' => 'string', 'group' => 'general'],
            ['key' => 'site_tagline', 'value' => 'Tourism Consultancy', 'type' => 'string', 'group' => 'general'],
            ['key' => 'tagline', 'value' => 'Tourism Consultancy', 'type' => 'string', 'group' => 'general'],
            ['key' => 'contact_email', 'value' => 'atm@artourismedia.com', 'type' => 'string', 'group' => 'contact'],
            ['key' => 'contact_phone', 'value' => '', 'type' => 'string', 'group' => 'contact'],
            ['key' => 'contact_address', 'value' => 'Philippines', 'type' => 'string', 'group' => 'contact'],
            ['key' => 'footer_text', 'value' => '© Art! Boncato Tourism Consultancy. Creating destinations people remember.', 'type' => 'string', 'group' => 'general'],
            ['key' => 'newsletter_title', 'value' => 'Stay Connected', 'type' => 'string', 'group' => 'general'],
            ['key' => 'newsletter_description', 'value' => 'Get destination strategy insights delivered to your inbox.', 'type' => 'string', 'group' => 'general'],
            ['key' => 'footer_description', 'value' => 'We partner with governments, communities, and investors to design tourism experiences that leave lasting impressions.', 'type' => 'string', 'group' => 'footer'],
            ['key' => 'footer_tagline', 'value' => 'Creating destinations people remember.', 'type' => 'string', 'group' => 'footer'],
            ['key' => 'footer_copyright', 'value' => '© Art! Boncato Tourism Consultancy. All rights reserved.', 'type' => 'string', 'group' => 'footer'],
            ['key' => 'footer_email', 'value' => 'atm@artourismedia.com', 'type' => 'string', 'group' => 'footer'],
            ['key' => 'footer_phone', 'value' => '', 'type' => 'string', 'group' => 'footer'],
            ['key' => 'footer_address', 'value' => 'Philippines', 'type' => 'string', 'group' => 'footer'],
            ['key' => 'primary_color', 'value' => '#078C95', 'type' => 'string', 'group' => 'branding'],
            ['key' => 'secondary_color', 'value' => '#FF5A1F', 'type' => 'string', 'group' => 'branding'],
            ['key' => 'accent_color', 'value' => '#0B2447', 'type' => 'string', 'group' => 'branding'],
            ['key' => 'google_analytics_id', 'value' => '', 'type' => 'string', 'group' => 'branding'],
            ['key' => 'default_seo_title', 'value' => 'Art! Boncato | Tourism Consultancy', 'type' => 'string', 'group' => 'branding'],
            ['key' => 'default_seo_description', 'value' => 'Art Boncato Tourism Consultancy helps governments and communities shape inspiring destinations people remember.', 'type' => 'string', 'group' => 'branding'],
            ['key' => 'logo_url', 'value' => '/images/brand/artourismedia-logo.png', 'type' => 'string', 'group' => 'branding'],
            ['key' => 'favicon_url', 'value' => Assets::url('/favicon.png'), 'type' => 'string', 'group' => 'branding'],
        ];

        foreach ($settings as $setting) {
            SiteSetting::query()->updateOrCreate(['key' => $setting['key']], $setting);
        }
    }

    protected function seedNavigation(): void
    {
        $items = [
            ['label' => 'Home', 'url' => '/', 'sort_order' => 1],
            ['label' => 'About', 'url' => '/about', 'sort_order' => 2],
            ['label' => 'Services', 'url' => '/services', 'sort_order' => 3],
            ['label' => 'Projects', 'url' => '/projects', 'sort_order' => 4],
            ['label' => 'Insights', 'url' => '/insights', 'sort_order' => 5],
            ['label' => 'Schedule a Consultation', 'url' => '/contact', 'sort_order' => 6, 'is_cta' => true],
        ];

        $labels = [];

        foreach ($items as $item) {
            $labels[] = $item['label'];
            NavigationItem::query()->updateOrCreate(
                ['label' => $item['label']],
                array_merge(['target' => '_self', 'is_active' => true, 'is_cta' => false], $item)
            );
        }

        NavigationItem::query()
            ->whereNotIn('label', $labels)
            ->update(['is_active' => false]);
    }

    protected function seedHomepageSections(): void
    {
        $sections = [
            [
                'type' => 'hero',
                'title' => 'Hero',
                'content' => [
                    'badge_text' => 'Turning Strategy into Impact',
                    'headline_prefix' => 'We Deliver',
                    'headline_highlight' => 'Results-Oriented',
                    'headline_middle' => '',
                    'headline_accent' => 'Tourism Solutions',
                    'subheadline' => 'We are a team that collaborates with people, organizations, and destinations to deliver tailored solutions in tourism development. Our group has solid experience in tourism strategy and planning, product development, standards and regulation, learning and development, governance, branding, marketing, MICE execution and delivery.',
                    'cta_text' => 'Work Together',
                    'cta_url' => '/contact',
                    'secondary_cta_text' => 'Explore Our Work',
                    'secondary_cta_url' => '/projects',
                    'image_url' => Assets::url('/images/hero/hero-slideshow-01-pamulak-float.jpg'),
                    'image_alt' => 'Art Boncato Tourism Consultancy',
                ],
                'sort_order' => 1,
            ],
            [
                'type' => 'trust_strip',
                'title' => 'Trusted partners in nation building',
                'content' => [],
                'sort_order' => 2,
            ],
            [
                'type' => 'about',
                'title' => 'About',
                'content' => [
                    'eyebrow' => 'About Art Boncato',
                    'title' => 'A Career Built Around Tourism',
                    'body' => '<p>Art Boncato, Jr. is a tourism and hospitality executive who continues to build on a career spanning 30 years.</p>',
                    'cta_text' => 'More About Art',
                    'cta_url' => '/about',
                    'image_url' => Assets::url('/images/about/art-boncato-portrait.png?v=17'),
                    'image_alt' => 'Art Boncato professional portrait',
                ],
                'sort_order' => 3,
            ],
            [
                'type' => 'services',
                'title' => 'Services',
                'content' => [
                    'eyebrow' => 'Our Services',
                    'title' => 'Offering solutions for',
                    'title_accent' => 'sustainable tourism growth.',
                    'description' => 'From master planning to campaign launch, we partner with you at every stage.',
                ],
                'sort_order' => 4,
            ],
            [
                'type' => 'featured_projects',
                'title' => 'Featured Projects',
                'content' => [
                    'eyebrow' => 'Featured Projects',
                    'title' => 'Recent destination transformations',
                    'cta_text' => 'View All Projects',
                    'cta_url' => '/projects',
                ],
                'sort_order' => 5,
            ],
            [
                'type' => 'statistics',
                'title' => 'Statistics',
                'content' => [],
                'sort_order' => 6,
            ],
            [
                'type' => 'latest_insights',
                'title' => 'Latest Insights',
                'content' => [
                    'eyebrow' => 'Latest Insights',
                    'title' => 'Thought leadership for destination builders',
                    'cta_text' => 'View All Insights',
                    'cta_url' => '/insights',
                ],
                'sort_order' => 7,
            ],
        ];

        foreach ($sections as $section) {
            HomepageSection::query()->updateOrCreate(
                ['type' => $section['type']],
                array_merge(['is_active' => true], $section)
            );
        }
    }

    protected function seedTrustStrip(): void
    {
        $items = [
            ['title' => 'Local Governments', 'description' => 'Across the Philippines', 'icon' => 'building', 'sort_order' => 1],
            ['title' => 'Development Partners', 'description' => 'National & International', 'icon' => 'users-group', 'sort_order' => 2],
            ['title' => 'Private Sector Organizations', 'description' => 'Business & Industry', 'icon' => 'chart-growth', 'sort_order' => 3],
            ['title' => 'Academe & Research Institutions', 'description' => 'Knowledge Partners', 'icon' => 'graduation-cap', 'sort_order' => 4],
            ['title' => 'Investors & Stakeholders', 'description' => 'Private & Global', 'icon' => 'handshake', 'sort_order' => 5],
        ];

        foreach ($items as $item) {
            TrustStripItem::query()->updateOrCreate(['title' => $item['title']], array_merge(['is_active' => true], $item));
        }
    }

    protected function seedStatistics(): void
    {
        $stats = [
            ['number' => '30', 'suffix' => '+', 'title' => 'Years of Experience', 'description' => 'Destination strategy expertise', 'icon' => 'award', 'sort_order' => 1],
            ['number' => '100', 'suffix' => '+', 'title' => 'Destinations Served', 'description' => 'Across the Philippines and ASEAN', 'icon' => 'map-pin', 'sort_order' => 2],
            ['number' => '200', 'suffix' => '+', 'title' => 'Projects Completed', 'description' => 'From branding to master plans', 'icon' => 'briefcase', 'sort_order' => 3],
            ['number' => 'Global', 'title' => 'Perspective. Local Impact.', 'description' => 'International standards, community roots', 'icon' => 'globe', 'sort_order' => 4],
        ];

        foreach ($stats as $stat) {
            Statistic::query()->updateOrCreate(['title' => $stat['title']], array_merge(['is_active' => true, 'prefix' => null], $stat));
        }
    }

    protected function seedSocialLinks(): void
    {
        $links = [
            ['platform' => 'Facebook', 'username' => '/artboncato', 'url' => 'https://facebook.com/artboncato', 'icon' => 'facebook', 'sort_order' => 1],
            ['platform' => 'Instagram', 'username' => '@artboncato', 'url' => 'https://instagram.com/artboncato', 'icon' => 'instagram', 'sort_order' => 2],
            ['platform' => 'LinkedIn', 'username' => '/in/artboncato', 'url' => 'https://linkedin.com/in/artboncato', 'icon' => 'linkedin', 'sort_order' => 3],
            ['platform' => 'TikTok', 'username' => '@artboncato', 'url' => 'https://tiktok.com/@artboncato', 'icon' => 'tiktok', 'sort_order' => 4],
        ];

        foreach ($links as $link) {
            SocialLink::query()->updateOrCreate(['platform' => $link['platform']], array_merge(['is_active' => true], $link));
        }
    }

    protected function seedServices(): void
    {
        $services = [
            [
                'slug' => 'tourism-planning-development',
                'title' => 'Tourism Planning and Development',
                'description' => 'We have both regional and national experience. We want to deliver results that provide significant local economic growth. And focus on a friendly, seamless, engaging and distinctive guest experience. Without losing sight of this, we aim at the balance between safeguarding natural resources, developing destination heritage, and fair distribution of revenues between stakeholders.',
                'content' => '<p>We are guided by the Visitor, Industry, Community and Environment (VICE) framework, from the research process right through to every practical action on the ground.</p><h3>Projects and Experience:</h3><ul><li>Camiguin Tourism Development Plan 2025-2028</li><li>Mts. Timpoong- Hibok-Hibok National Monument (MTHNM) Ecotourism and Management Plan 2022</li><li>Island Garden City of Samal (IGACOS) Tourism Plans Review 2022</li><li>Camiguin Pivot and Transformation : A Tourism Recovery Plan 2021-2023</li><li>Mantigue Island Tourism Management Plan 2021</li><li>Implementing the Siargao Tourism Master Plan (STMP): Action Plan Recommendations 2021</li></ul>',
                'category' => 'Planning',
                'icon' => 'tourism-planning',
                'image_url' => '/images/services/tourism-planning-development.jpg?v=4',
                'sort_order' => 1,
            ],
            [
                'slug' => 'destination-branding-marketing',
                'title' => 'Destination Branding and Marketing',
                'description' => 'Everything we do is based on understanding the story and identity of a destination. We help host communities articulate the ideals and reputation of the place we work with. Then we strategically communicate these.',
                'content' => '<p>We underline the significance of stakeholder buy-in as an essential step in the process.</p><h3>Projects and Experience:</h3><ul><li>Isle Be There Marketing Plan 2024, 2025, 2026</li><li>Camiguin Isle Be There Branding 2024</li><li>Clean Camiguin Marketing Plan 2021, 2022, 2023</li><li>Clean Camiguin Branding 2021</li></ul>',
                'category' => 'Marketing',
                'icon' => 'destination-branding',
                'image_url' => '/images/services/destination-branding-marketing.png',
                'sort_order' => 2,
            ],
            [
                'slug' => 'mice-management',
                'title' => 'MICE Management',
                'description' => 'Events delivery is one of the primary services our group provides. We have at least a generation of expertise in planning, organizing, and execution of Meetings, Incentives, Convention and Exhibitions (MICE) regionally and nationwide.',
                'content' => '<p>This main service also includes consulting and actual facility management and specialist manufacturing for exhibits.</p><h3>Projects and Experience:</h3><ul><li>Camiguin International Convention Center (conceptual stage)</li><li>ASEAN Tourism Forum (ATF) and ASEAN Summit Opening Ceremonies 2026 at The Mactan Expo (coordination team member for Megaworld Hotels and Resorts)</li><li>World Trade Center Metro Manila (senior leadership) 2022-2024</li><li>Iloilo MICE Situation Report and Marketing Plan (for the Department of Tourism) 2019</li><li>50th Asian Development Bank Summit 2018 (official Philippine government lead organizer with the ADB)</li><li>Kadayawan Festival 2016 (Co-chairman of Mayor Sara Duterte-Carpio)</li><li>ASEAN Tourism Forum (ATF) 2006 (Co-Chairman of Mayor Rodrigo R. Duterte, Davao Organizing Committee)</li><li>Conventions and Events Organizers, Inc. 1995-2001 (organized at least 70 local and regional MICE projects as lone Mindanao Professional Convention Organizer accredited by the Philippine Convention and Visitors Corporation now named Tourism Promotions Board)</li></ul>',
                'category' => 'MICE',
                'icon' => 'mice-events',
                'image_url' => '/images/services/mice-management.png',
                'sort_order' => 3,
            ],
            [
                'slug' => 'thought-leadership-learning-development',
                'title' => 'Thought Leadership, Learning and Development',
                'description' => 'We work with partners to become trusted authority and respected expert source of knowledge in the tourism industry. We likewise collaborate with organizations that promote internationally acknowledged hospitality service quality in destinations.',
                'content' => '<p>This is accomplished by creating and utilizing tools that deal with problems affecting a skilled workforce in the hospitality sector.</p><h3>Projects and Experience</h3><ul><li>Camiguin Roundtable on Sustainable Island Destination Governance (September 2026)</li><li>Camiguin Tourism Training Institute (conceptual stage)</li></ul>',
                'category' => 'Learning',
                'icon' => 'learning-leadership',
                'image_url' => '/images/services/thought-leadership-learning-development.png',
                'sort_order' => 4,
            ],
            [
                'slug' => 'mindanao-connect',
                'title' => 'Mindanao CONNECT',
                'description' => 'Our group is an active player in the island\'s network of destinations and tourism sector leaders.',
                'content' => '<p>Make Mindanao your next greenfield. Let us help you in this.</p><h3>Projects and Experience</h3><ul><li>Mindanao Tourism Situation Report ( for crafting haha)</li><li>Mindanao Roadtrip with Art videos</li><li>Mindanao Fun 101 magazine digital file</li></ul>',
                'category' => 'Regional',
                'icon' => 'mindanao-connect',
                'image_url' => '/images/services/mindanao-connect.png',
                'sort_order' => 5,
            ],
        ];

        $slugs = [];

        foreach ($services as $service) {
            $slugs[] = $service['slug'];
            Service::query()->updateOrCreate(['slug' => $service['slug']], array_merge(['is_active' => true], $service));
        }

        Service::query()
            ->whereNotIn('slug', $slugs)
            ->update(['is_active' => false]);
    }

    protected function seedMindanaoConnectVideos(): void
    {
        $service = Service::query()->where('slug', 'mindanao-connect')->first();

        if (! $service) {
            return;
        }

        if (app()->environment('testing')) {
            ServiceVideo::query()->updateOrCreate(
                ['youtube_id' => 'hPBoDRcv-5U'],
                [
                    'service_id' => $service->id,
                    'youtube_url' => 'https://youtube.com/watch?v=hPBoDRcv-5U',
                    'title' => 'Mindanao Roadtrip with Art',
                    'description' => 'Featured video from the Mindanao CONNECT series.',
                    'is_active' => true,
                    'sort_order' => 1,
                ]
            );

            return;
        }

        try {
            app(MindanaoConnectVideoImportService::class)->importFromChannel();
        } catch (\Throwable) {
            ServiceVideo::query()->updateOrCreate(
                ['youtube_id' => 'hPBoDRcv-5U'],
                [
                    'service_id' => $service->id,
                    'youtube_url' => 'https://youtube.com/watch?v=hPBoDRcv-5U',
                    'title' => 'Mindanao Roadtrip with Art',
                    'description' => 'Featured video from the Mindanao CONNECT series.',
                    'is_active' => true,
                    'sort_order' => 1,
                ]
            );
        }
    }

    protected function seedProjectCategoriesAndProjects(): void
    {
        $categories = [
            ['name' => 'Island Destinations', 'slug' => 'island-destinations', 'color' => '#0EA5E9', 'sort_order' => 1],
            ['name' => 'Cultural Heritage', 'slug' => 'cultural-heritage', 'color' => '#A855F7', 'sort_order' => 2],
            ['name' => 'Urban Tourism', 'slug' => 'urban-tourism', 'color' => '#F97316', 'sort_order' => 3],
        ];

        foreach ($categories as $category) {
            ProjectCategory::query()->updateOrCreate(['slug' => $category['slug']], array_merge(['is_active' => true], $category));
        }

        $islandCategory = ProjectCategory::query()->where('slug', 'island-destinations')->first();

        Project::query()->updateOrCreate(
            ['slug' => 'clean-camiguin-pivot-transformation'],
            [
                'project_category_id' => $islandCategory?->id,
                'title' => 'Clean Camiguin Pivot and Transformation: A Post-Pandemic Strategic Development Plan',
                'excerpt' => 'A strategic framework developed to guide Camiguin\'s tourism sector through post-pandemic recovery and transformation. The plan provided a platform for repositioning the province, strengthening destination readiness and pursuing a more competitive, sustainable and resilient tourism economy.',
                'content' => '<p>A strategic framework developed to guide Camiguin\'s tourism sector through post-pandemic recovery and transformation. The plan provided a platform for repositioning the province, strengthening destination readiness and pursuing a more competitive, sustainable and resilient tourism economy.</p>',
                'cover_image_url' => Assets::url('/images/projects/clean-camiguin.png?v=16'),
                'category_label' => 'Strategy & Planning',
                'is_featured' => false,
                'is_published' => true,
                'sort_order' => 6,
                'color' => '#078C95',
            ]
        );

        Project::query()->updateOrCreate(
            ['slug' => 'mantigue-island-tourism-management-plan'],
            [
                'project_category_id' => $islandCategory?->id,
                'title' => 'Mantigue Island Tourism Management Plan',
                'excerpt' => 'A destination-level management plan designed to balance visitor experience, environmental protection and community benefits. It established actionable measures for visitor management, carrying capacity, tourism facilities, product enhancement, safety and service standards, stakeholder participation and the long-term protection of Mantigue Island\'s natural resources.',
                'content' => '<p>A destination-level management plan designed to balance visitor experience, environmental protection and community benefits. It established actionable measures for visitor management, carrying capacity, tourism facilities, product enhancement, safety and service standards, stakeholder participation and the long-term protection of Mantigue Island\'s natural resources.</p>',
                'cover_image_url' => Assets::url('/images/projects/mantigue-island.jpg'),
                'category_label' => 'Destination Management',
                'is_featured' => true,
                'is_published' => true,
                'sort_order' => 2,
                'color' => '#078C95',
            ]
        );

        Project::query()->updateOrCreate(
            ['slug' => 'mounts-timpoong-hibok-hibok-ecotourism-plan'],
            [
                'project_category_id' => $islandCategory?->id,
                'title' => 'Mounts Timpoong and Hibok-Hibok Ecotourism Management and Investment Plan',
                'excerpt' => 'An integrated ecotourism framework for the sustainable development and management of the Mounts Timpoong–Hibok-Hibok landscape. The engagement combined conservation, visitor experience, community participation, site management and investment planning to support responsible tourism within an environmentally sensitive destination.',
                'content' => '<p>An integrated ecotourism framework for the sustainable development and management of the Mounts Timpoong–Hibok-Hibok landscape. The engagement combined conservation, visitor experience, community participation, site management and investment planning to support responsible tourism within an environmentally sensitive destination.</p>',
                'cover_image_url' => Assets::url('/images/projects/mounts-timpoong-hibok-hibok.png'),
                'category_label' => 'Ecotourism & Conservation',
                'is_featured' => true,
                'is_published' => true,
                'sort_order' => 3,
                'color' => '#078C95',
            ]
        );

        Project::query()->updateOrCreate(
            ['slug' => 'samal-strategic-action-plan'],
            [
                'project_category_id' => $islandCategory?->id,
                'title' => 'Reformulated Island Garden City of Samal Strategic Action Plan',
                'excerpt' => 'An updated strategic action plan responsive to changing tourism conditions, emerging market opportunities and evolving destination-management requirements. The plan identified priority interventions for strengthening Samal\'s tourism competitiveness while protecting the island\'s environmental resources and promoting benefits for its communities and tourism enterprises.',
                'content' => '<p>An updated strategic action plan responsive to changing tourism conditions, emerging market opportunities and evolving destination-management requirements. The plan identified priority interventions for strengthening Samal\'s tourism competitiveness while protecting the island\'s environmental resources and promoting benefits for its communities and tourism enterprises.</p>',
                'cover_image_url' => Assets::url('/images/projects/samal-island.jpg'),
                'category_label' => 'Strategy & Planning',
                'is_featured' => true,
                'is_published' => true,
                'sort_order' => 1,
                'color' => '#078C95',
            ]
        );

        Project::query()->updateOrCreate(
            ['slug' => 'camiguin-tourism-development-action-plan-2026-2028'],
            [
                'project_category_id' => $islandCategory?->id,
                'title' => 'Camiguin Tourism Development Action Plan 2026–2028',
                'excerpt' => 'A results-oriented action plan that translates Camiguin\'s tourism vision into coordinated programs, projects, implementation responsibilities and investment priorities. It provides a practical roadmap for government, tourism enterprises, communities and development partners to advance the province\'s tourism goals over the three-year period.',
                'content' => '<p>A results-oriented action plan that translates Camiguin\'s tourism vision into coordinated programs, projects, implementation responsibilities and investment priorities. It provides a practical roadmap for government, tourism enterprises, communities and development partners to advance the province\'s tourism goals over the three-year period.</p>',
                'cover_image_url' => Assets::url('/images/projects/camiguin-sunken-cemetery.jpg'),
                'category_label' => 'Strategy & Planning',
                'is_featured' => true,
                'is_published' => true,
                'sort_order' => 5,
                'color' => '#078C95',
            ]
        );

    }

    protected function seedPostCategoriesTagsAndPosts(User $admin): void
    {
        $categories = [
            ['name' => 'Strategy', 'slug' => 'strategy', 'description' => 'Destination strategy and sustainable tourism planning.', 'sort_order' => 1],
            ['name' => 'Marketing', 'slug' => 'marketing', 'description' => 'Destination branding and marketing insights.', 'sort_order' => 2],
            ['name' => 'Media', 'slug' => 'media', 'description' => 'Tourism media production and storytelling.', 'sort_order' => 3],
        ];

        foreach ($categories as $category) {
            PostCategory::query()->updateOrCreate(['slug' => $category['slug']], array_merge(['is_active' => true], $category));
        }

        $tags = [
            ['name' => 'Branding', 'slug' => 'branding'],
            ['name' => 'Digital Marketing', 'slug' => 'digital-marketing'],
            ['name' => 'Community Tourism', 'slug' => 'community-tourism'],
            ['name' => 'Eco Tourism', 'slug' => 'eco-tourism'],
        ];

        foreach ($tags as $tag) {
            Tag::query()->updateOrCreate(['slug' => $tag['slug']], $tag);
        }

        $strategyCategory = PostCategory::query()->where('slug', 'strategy')->first();
        $marketingCategory = PostCategory::query()->where('slug', 'marketing')->first();
        $mediaCategory = PostCategory::query()->where('slug', 'media')->first();
        $brandingTag = Tag::query()->where('slug', 'branding')->first();
        $digitalTag = Tag::query()->where('slug', 'digital-marketing')->first();

        $post = Post::query()->updateOrCreate(
            ['slug' => 'future-of-sustainable-tourism-philippines'],
            [
                'post_category_id' => $strategyCategory?->id,
                'author_id' => $admin->id,
                'title' => 'The Future of Sustainable Tourism in the Philippines',
                'excerpt' => 'How provinces and cities can grow visitation responsibly while protecting culture, communities, and natural assets.',
                'content' => '<p>Sustainable tourism is no longer optional—it is the foundation for long-term destination health. We explore practical frameworks LGUs and DMOs can adopt today.</p>',
                'featured_image_url' => Assets::url('/images/posts/sustainable-tourism.png'),
                'status' => 'published',
                'is_featured' => true,
                'reading_time' => 6,
                'published_at' => now()->subDays(5),
                'seo_title' => 'The Future of Sustainable Tourism in the Philippines | Art Boncato',
                'seo_description' => 'Practical sustainable tourism strategies for Philippine destinations.',
            ]
        );

        if ($brandingTag && $digitalTag) {
            $post->tags()->sync([$brandingTag->id, $digitalTag->id]);
        }

        Post::query()->updateOrCreate(
            ['slug' => 'building-destination-brands-that-last'],
            [
                'post_category_id' => $marketingCategory?->id,
                'author_id' => $admin->id,
                'title' => 'Building Destination Brands That Last',
                'excerpt' => 'In a crowded tourism market, the destinations that win are the ones with a narrative visitors can feel—not just see.',
                'content' => '<p>Story-led destination branding creates emotional connection before the first booking. We explore how to craft authentic narratives rooted in local culture and community pride.</p>',
                'featured_image_url' => Assets::url('/images/posts/destination-brands.png'),
                'status' => 'published',
                'is_featured' => true,
                'reading_time' => 7,
                'published_at' => now()->subDays(10),
            ]
        );

        Post::query()->updateOrCreate(
            ['slug' => 'power-of-storytelling-in-tourism'],
            [
                'post_category_id' => $mediaCategory?->id,
                'author_id' => $admin->id,
                'title' => 'The Power of Storytelling in Tourism',
                'excerpt' => 'Why compelling media and authentic stories are essential tools for destination marketers in the digital age.',
                'content' => '<p>From drone footage to community voices, we outline how tourism boards can use media production to create emotional connection and drive visitation.</p>',
                'featured_image_url' => Assets::url('/images/posts/storytelling-tourism.png'),
                'status' => 'published',
                'is_featured' => true,
                'reading_time' => 5,
                'published_at' => now()->subDays(14),
            ]
        );

        Post::query()->updateOrCreate(
            ['slug' => 'camiguin-tourism-development-plan-2026-2028'],
            [
                'post_category_id' => $strategyCategory?->id,
                'author_id' => $admin->id,
                'title' => 'Camiguin\'s 2026–2028 Tourism Roadmap Takes Shape',
                'excerpt' => 'A results-oriented action plan translates Camiguin\'s tourism vision into coordinated programs, implementation responsibilities and investment priorities for the next three years.',
                'content' => '<p>Camiguin is moving from broad vision to coordinated action. The province\'s Tourism Development Action Plan 2026–2028 sets out practical programs, implementation roles and investment priorities for government, tourism enterprises, communities and development partners.</p><p>It builds on recent planning work across the island and gives stakeholders a shared roadmap for strengthening competitiveness while protecting Camiguin\'s natural and cultural assets.</p><p><a href="/projects/camiguin-tourism-development-action-plan-2026-2028">View the Camiguin Tourism Development Action Plan 2026–2028 project</a></p>',
                'featured_image_url' => Assets::url('/images/projects/camiguin-sunken-cemetery.jpg'),
                'status' => 'published',
                'is_featured' => true,
                'reading_time' => 5,
                'published_at' => now(),
                'seo_title' => 'Camiguin Tourism Development Action Plan 2026–2028 | Art Boncato',
                'seo_description' => 'How Camiguin\'s new tourism action plan turns vision into coordinated programs and investment priorities.',
            ]
        );

        Post::query()->updateOrCreate(
            ['slug' => 'samal-island-tourism-strategic-action-plan'],
            [
                'post_category_id' => $strategyCategory?->id,
                'author_id' => $admin->id,
                'title' => 'Samal Island Refreshes Its Tourism Strategic Action Plan',
                'excerpt' => 'An updated strategic action plan helps Samal respond to changing tourism conditions while protecting environmental resources and delivering benefits for communities and enterprises.',
                'content' => '<p>The Island Garden City of Samal has updated its strategic action plan to reflect new market opportunities, shifting visitor expectations and evolving destination-management requirements.</p><p>The reformulated plan identifies priority interventions for strengthening Samal\'s tourism competitiveness, safeguarding the island\'s environmental resources and ensuring communities and tourism enterprises share in the benefits of growth.</p><p><a href="/projects/samal-strategic-action-plan">View the Samal Strategic Action Plan project</a></p>',
                'featured_image_url' => Assets::url('/images/projects/samal-island.jpg'),
                'status' => 'published',
                'is_featured' => true,
                'reading_time' => 6,
                'published_at' => now()->subDay(),
                'seo_title' => 'Samal Island Tourism Strategic Action Plan | Art Boncato',
                'seo_description' => 'How Samal\'s refreshed tourism strategic action plan supports competitiveness, communities and environmental protection.',
            ]
        );

        Post::query()->updateOrCreate(
            ['slug' => 'clean-camiguin-post-pandemic-transformation'],
            [
                'post_category_id' => $strategyCategory?->id,
                'author_id' => $admin->id,
                'title' => 'Clean Camiguin: Repositioning Tourism After the Pandemic',
                'excerpt' => 'A post-pandemic strategic framework guides Camiguin\'s tourism recovery through destination readiness, sustainability and a more resilient provincial tourism economy.',
                'content' => '<p>The Clean Camiguin Pivot and Transformation plan provided a strategic platform for repositioning the province after the pandemic—strengthening destination readiness, improving competitiveness and building a more sustainable tourism economy.</p><p>It connected recovery priorities with longer-term transformation goals, giving Camiguin a clearer path for government, enterprises and communities to work together.</p><p><a href="/projects/clean-camiguin-pivot-transformation">View the Clean Camiguin Pivot and Transformation project</a></p>',
                'featured_image_url' => Assets::url('/images/projects/clean-camiguin.png?v=16'),
                'status' => 'published',
                'is_featured' => true,
                'reading_time' => 5,
                'published_at' => now()->subDays(2),
                'seo_title' => 'Clean Camiguin Post-Pandemic Tourism Transformation | Art Boncato',
                'seo_description' => 'How Camiguin\'s Clean Camiguin plan supports post-pandemic tourism recovery and transformation.',
            ]
        );
    }

    protected function seedPages(): void
    {
        $aboutMetadata = AboutPageMetadata::defaults();

        Page::query()->updateOrCreate(
            ['slug' => 'about'],
            [
                'title' => 'About Art Boncato',
                'content' => $aboutMetadata['career_body'],
                'metadata' => $aboutMetadata,
                'is_published' => true,
                'seo_title' => 'About Art Boncato | ArTourisMedia',
                'seo_description' => 'Learn about Art Boncato, Jr.—tourism and hospitality executive leading ArTourisMedia with bespoke solutions for destinations across the Philippines.',
            ]
        );

        Page::query()->updateOrCreate(
            ['slug' => 'privacy-policy'],
            [
                'title' => 'Privacy Policy',
                'content' => LegalPageContent::privacyPolicy(),
                'is_published' => true,
                'seo_title' => 'Privacy Policy | ArTourisMedia',
                'seo_description' => 'Learn how ArTourisMedia collects, uses, and protects personal information submitted through our website, contact forms, and newsletter.',
            ]
        );

        Page::query()->updateOrCreate(
            ['slug' => 'terms-of-use'],
            [
                'title' => 'Terms of Use',
                'content' => LegalPageContent::termsOfUse(),
                'is_published' => true,
                'seo_title' => 'Terms of Use | ArTourisMedia',
                'seo_description' => 'Terms governing use of the ArTourisMedia website, content, and online communications.',
            ]
        );
    }

    protected function seedSeoSettings(): void
    {
        $settings = [
            ['page_key' => 'home', 'title' => 'Art! Boncato | Tourism Consultancy', 'description' => 'Art Boncato Tourism Consultancy helps governments and communities shape inspiring destinations people remember.'],
            ['page_key' => 'services', 'title' => 'Tourism Consultancy Services | Art Boncato', 'description' => 'Tourism planning, destination branding, MICE management, learning and development, and Mindanao CONNECT.'],
            ['page_key' => 'projects', 'title' => 'Featured Projects | Art Boncato', 'description' => 'Explore destination master plans, branding campaigns, and international promotion projects.'],
            ['page_key' => 'posts', 'title' => 'Tourism Insights | Art Boncato', 'description' => 'Articles on sustainable tourism, destination branding, and tourism media storytelling.'],
            ['page_key' => 'contact', 'title' => 'Contact Art Boncato', 'description' => 'Schedule a consultation with Art Boncato Tourism Consultancy.'],
        ];

        foreach ($settings as $setting) {
            SeoSetting::query()->updateOrCreate(['page_key' => $setting['page_key']], $setting);
        }
    }

    protected function seedNewsletterSubscribers(): void
    {
        NewsletterSubscriber::query()->updateOrCreate(
            ['email' => 'subscriber@example.com'],
            [
                'name' => 'Sample Subscriber',
                'status' => 'subscribed',
                'subscribed_at' => now()->subDays(30),
                'unsubscribe_token' => Str::random(64),
            ]
        );
    }
}
