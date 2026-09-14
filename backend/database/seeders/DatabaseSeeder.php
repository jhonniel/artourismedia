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
            ['key' => 'footer_copyright', 'value' => '© '.date('Y').' Art! Boncato Tourism Consultancy. All rights reserved.', 'type' => 'string', 'group' => 'footer'],
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
                'image_url' => '/images/services/destination-branding-marketing.jpg?v=2',
                'sort_order' => 2,
            ],
            [
                'slug' => 'mice-management',
                'title' => 'MICE Management',
                'description' => 'Events delivery is one of the primary services our group provides. We have at least a generation of expertise in planning, organizing, and execution of Meetings, Incentives, Convention and Exhibitions (MICE) regionally and nationwide.',
                'content' => '<p>This main service also includes consulting and actual facility management and specialist manufacturing for exhibits.</p><h3>Projects and Experience:</h3><ul><li>Camiguin International Convention Center (conceptual stage)</li><li>ASEAN Tourism Forum (ATF) and ASEAN Summit Opening Ceremonies 2026 at The Mactan Expo (coordination team member for Megaworld Hotels and Resorts)</li><li>World Trade Center Metro Manila (senior leadership) 2022-2024</li><li>Iloilo MICE Situation Report and Marketing Plan (for the Department of Tourism) 2019</li><li>50th Asian Development Bank Summit 2018 (official Philippine government lead organizer with the ADB)</li><li>Kadayawan Festival 2016 (Co-chairman of Mayor Sara Duterte-Carpio)</li><li>ASEAN Tourism Forum (ATF) 2006 (Co-Chairman of Mayor Rodrigo R. Duterte, Davao Organizing Committee)</li><li>Conventions and Events Organizers, Inc. 1995-2001 (organized at least 70 local and regional MICE projects as lone Mindanao Professional Convention Organizer accredited by the Philippine Convention and Visitors Corporation now named Tourism Promotions Board)</li></ul>',
                'category' => 'MICE',
                'icon' => 'mice-events',
                'image_url' => '/images/services/mice-management.jpg?v=2',
                'sort_order' => 3,
            ],
            [
                'slug' => 'thought-leadership-learning-development',
                'title' => 'Thought Leadership, Learning and Development',
                'description' => 'We work with partners to become trusted authority and respected expert source of knowledge in the tourism industry. We likewise collaborate with organizations that promote internationally acknowledged hospitality service quality in destinations.',
                'content' => '<p>This is accomplished by creating and utilizing tools that deal with problems affecting a skilled workforce in the hospitality sector.</p><h3>Projects and Experience</h3><ul><li>Camiguin Roundtable on Sustainable Island Destination Governance (September 2026)</li><li>Camiguin Tourism Training Institute (conceptual stage)</li></ul>',
                'category' => 'Learning',
                'icon' => 'learning-leadership',
                'image_url' => '/images/services/thought-leadership-learning-development.jpg?v=2',
                'sort_order' => 4,
            ],
            [
                'slug' => 'mindanao-connect',
                'title' => 'Mindanao CONNECT',
                'description' => 'Our group is an active player in the island\'s network of destinations and tourism sector leaders.',
                'content' => '<p>Make Mindanao your next greenfield. Let us help you in this.</p><h3>Projects and Experience</h3><ul><li>Mindanao Tourism Situation Report ( for crafting haha)</li><li>Mindanao Roadtrip with Art videos</li><li>Mindanao Fun 101 magazine digital file</li></ul>',
                'category' => 'Regional',
                'icon' => 'mindanao-connect',
                'image_url' => '/images/services/mindanao-connect.jpg?v=2',
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
                'cover_image_url' => Assets::url('/images/projects/mounts-timpoong-hibok-hibok.jpg?v=1'),
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

        Post::query()->updateOrCreate(
            ['slug' => 'atf-2006-davao-asean-tourism-showcase'],
            [
                'post_category_id' => $mediaCategory?->id,
                'author_id' => $admin->id,
                'title' => 'ATF 2006 in Davao to showcase the best of ASEAN tourism',
                'excerpt' => 'A nine-day ASEAN Tourism Forum in Davao City brought together thousands of regional tourism executives, buyers, and sellers to showcase the best of ASEAN tourism products and cooperation.',
                'content' => '<p><strong>DAVAO CITY</strong> — A virtual showcase of the best in tourism products in the Association of Southeast Asian Nations (ASEAN) will be showcased in this southern metropolis when the nine-day ASEAN Tourism Forum (ATF) 2006 kicks off tomorrow.</p><p>According to Art Boncato, chairman of the local host council of the ATF 2006, hundreds of tourism sellers from all over the region shall put their best foot forward for the many buyers joining the much-awaited and biggest tourism event in ASEAN.</p><p>“It would be like traveling to the different parts of ASEAN as everyone would be represented here during the ATF,” he said.</p><p>Boncato said it’s all systems go for the ATF as preparations have gone full-blast for the arrival of more than 3,000 tourism executives and major players not only from the region but from around the world as well.</p><p>“It would be an exciting event as it would not only give us Filipinos the chance to showcase our wealth, but also there would be an exchange of opportunities and continued cooperation among the participants in the ATF,” he said.</p><p>Mayor Rodrigo Duterte said the ATF is seen to help further boost the economic development of the South.</p><p>Duterte has earmarked over P20 million for the necessary infrastructure in preparation for the holding of the ATF and another P7 million for the security requirements of the delegates.</p><p>As part of the infrastructure component, the major thoroughfares are dotted with orchid-shaped lampposts, showing that Davao City is an “orchid city.”</p><p>The ATF 2006 gathers the highest ranking tourism officials of Indonesia, Malaysia, Singapore, Thailand, Brunei Darussalam, Vietnam, Myanmar, Cambodia, Laos and the Philippines.</p><p>Also expected to attend the event are the tourism ministers of Japan, China and South Korea, being part of the “ASEAN + 3” grouping.</p><p>The ATF is expected to lure buyers of tourism products not only from the ASEAN member-nations but also from Europe, the United States and the Middle East.</p><p>All the hotels and inns here have undergone major refurbishing and renovation in preparation for ATF 2006, which shall include a meeting of the ASEAN Joint Tourism Task Force to discuss areas of cooperation in promoting the region’s tourism attractions, facilities, services and investments.</p><p>One of the ATF 2006’s highlights is the meeting of the ASEAN tourism ministers on Jan. 16 to further strengthen their cooperation.</p><p>Various tourism-related ASEAN organizations such as the Federation of ASEAN Travel Associations, Association of ASEAN Airlines, Association of ASEAN Hotels and Restaurants and the ASEAN Tourism Association are holding separate meetings during the nine-day ATF.</p>',
                'featured_image_url' => Assets::url('/images/hero/hero-slideshow-01-pamulak-float.jpg'),
                'status' => 'published',
                'is_featured' => true,
                'reading_time' => 5,
                'published_at' => now()->subHour(),
                'seo_title' => 'ATF 2006 Davao ASEAN Tourism Forum | Art Boncato',
                'seo_description' => 'How Davao City hosted ASEAN Tourism Forum 2006, showcasing ASEAN tourism products and leadership from Art Boncato and Mayor Rodrigo Duterte.',
            ]
        );

        Post::query()->updateOrCreate(
            ['slug' => 'philippines-rising-muslim-friendly-destination-halal-travel-summit'],
            [
                'post_category_id' => $mediaCategory?->id,
                'author_id' => $admin->id,
                'title' => 'Philippines recognized as rising Muslim-friendly destination at halal travel summit',
                'excerpt' => 'Developing halal travel has been a key part of the Philippines\' tourism strategy as the Muslim travel market is expected to reach 245 million international arrivals by 2030.',
                'content' => '<ul><li>Developing halal travel has been key part of the Philippines\' tourism strategy</li><li>Muslim travel market expected to reach 245 million international arrivals by 2030</li></ul><p><strong>MANILA:</strong> The Philippines has been recognized as a rising Muslim-friendly destination at this year\'s Halal in Travel Global Summit, where one of the country\'s officials and a Filipino hotel chain were also honored for their work in promoting halal tourism.</p><p>The Philippines stands among three other countries — Thailand, Ireland and Spain — in the Rising Muslim-friendly non-Organization of Islamic Cooperation Destinations in the latest edition of the Mastercard-CrescentRating Global Muslim Travel Index.</p><p>The index is an annual report benchmarking destinations in the Muslim travel market.</p><p>At the summit in Singapore earlier this week, Philippine Tourism Undersecretary Myra Paz Abubakar was named Halal Travel Personality of the Year, while the country\'s largest hotel operator, Megaworld Hotels and Resorts, won the Muslim-friendly Hotel Chain of the Year Award.</p><p>“This means that the DOT (Department of Tourism) is on the right track with our programs for Muslim-friendly and halal tourism. We have already done a lot but there is still so much to be done,” Abubakar, who was recognized for her “instrumental role” in advancing Muslim-friendly tourism in the Philippines, told Arab News on Saturday.</p><p>The archipelagic country, known for its white-sand beaches, diving spots and rich culture, has in recent years stepped up efforts to cater to Muslim tourists by ensuring that they have access to halal products and services.</p><p>“We have to continue moving forward and upward as the Muslim Market is a big market waiting to be tapped,” Abubakar said.</p><p>The Muslim travel market is on the rise, with international Muslim arrivals reaching 176 million people in 2024, according to the GMTI. The report estimates that the market will grow to 245 million arrivals by 2030, with their travel expenditure reaching $235 billion.</p><p>The index has noted the Philippines\' efforts to become a Muslim-friendly destination since 2021, and awarded the country the Emerging Muslim-friendly Destination accolade at the halal travel summit in 2023.</p><p>While the category has been removed for the 2025 edition, the GMTI covered the Philippines and its efforts to promote halal tourism, such as establishing more Muslim-friendly airports, to create a more inclusive travel experience.</p><p>The predominantly Catholic country — where Muslims constitute about 10 percent of the almost 120 million population — also launched last year a beach dedicated to Muslim women travelers in Boracay, the country\'s top resort island and one of the world\'s most popular.</p><p>Those efforts, part of the Philippines\' move to diversify its economy away from dependency on the declining Chinese market, have led to a recent surge in international tourism arrivals from countries in the Middle East and the Gulf Cooperation Council.</p><p><a href="https://www.arabnews.com/world/philippines-recognized-as-rising-muslim-friendly-destination-at-halal-travel-summit-2604468" target="_blank" rel="noopener noreferrer">Read the full article on Arab News</a> (June 14, 2025).</p>',
                'featured_image_url' => Assets::url('/images/posts/halal-travel-summit-award.jpg'),
                'status' => 'published',
                'is_featured' => true,
                'reading_time' => 6,
                'published_at' => now()->subHours(2),
                'seo_title' => 'Philippines Muslim-Friendly Destination Recognition | Arab News | Art Boncato',
                'seo_description' => 'Arab News reports on the Philippines\' rising Muslim-friendly destination status and Megaworld Hotels & Resorts\' award at the Halal in Travel Global Summit.',
            ]
        );

        Post::query()->updateOrCreate(
            ['slug' => 'dof-dti-adb-meeting-manila-2018'],
            [
                'post_category_id' => $mediaCategory?->id,
                'author_id' => $admin->id,
                'title' => 'DOF, DTI to team-up in hosting ADB meeting in Manila next yr.',
                'excerpt' => 'The Department of Finance tapped the Department of Trade and Industry—and Trade Assistant Secretary Arturo Boncato Jr.—to help organize the 51st annual meeting of the Asian Development Bank board of governors in Manila.',
                'content' => '<p>The Department of Finance (DOF) on Monday said it has tapped the expertise of the Department of Trade and Industry (DTI) in organizing the 51st annual meeting of the Asian Development Bank (ADB) board of governors.</p><p>Trade Assistant Secretary Arturo Boncato Jr., head of the DTI Competitiveness and Ease of Doing Business Group and a marketing and communications expert, will help the DOF organize the ADB Board of Governors meeting in Manila on May 3 to 6, 2018.</p><p>Finance Secretary Carlos G. Dominguez III was appointed chairman of the ADB Board of Governors in May, succeeding Japan Deputy Prime Minister and Finance Minister Taro Aso who chaired the 50th Annual Meeting in Yokohama.</p><p>Under the administration of former President Benigno Aquino III, Boncato was assistant secretary at the Department of Tourism and was in charge of handling special projects for Mindanao.</p><p><em>— Jon Viktor Cabuenas/VDS, GMA News</em></p><p><em>Originally published July 4, 2017 on <a href="https://www.gmanetwork.com/news/money/companies/616783/dof-dti-to-team-up-in-hosting-adb-meeting-in-manila-next-yr/story/" target="_blank" rel="noopener noreferrer">GMA News</a>.</em></p><p><a href="https://www.gmanetwork.com/news/money/companies/616783/dof-dti-to-team-up-in-hosting-adb-meeting-in-manila-next-yr/story/" target="_blank" rel="noopener noreferrer">Read the full article on GMA News</a></p>',
                'featured_image_url' => Assets::url('/images/services/mice-management.jpg?v=2'),
                'status' => 'published',
                'is_featured' => true,
                'reading_time' => 3,
                'published_at' => now()->subHour(),
                'seo_title' => 'DOF, DTI Host ADB Meeting Manila 2018 | Art Boncato | GMA News',
                'seo_description' => 'GMA News reports on Arturo Boncato Jr. supporting DOF and DTI in organizing the 51st Asian Development Bank board of governors meeting in Manila.',
            ]
        );

        Post::query()->updateOrCreate(
            ['slug' => 'dof-taps-dti-marketing-expert-adb-manila-2018'],
            [
                'post_category_id' => $mediaCategory?->id,
                'author_id' => $admin->id,
                'title' => 'DOF taps DTI marketing expert for 2018 ADB meeting in Manila',
                'excerpt' => 'The Department of Finance tapped DTI Assistant Secretary Arturo Boncato Jr.—a marketing and communications expert with a record in major Mindanao tourism projects—to help prepare Manila\'s hosting of the 51st ADB Board of Governors meeting.',
                'content' => '<p>A marketing and communications expert at the Department of Trade and Industry (DTI) with a sterling record in handling major tourism projects in Mindanao is working closely with the Department of Finance (DOF) in handling the preparations for the 2018 annual meeting of the Asian Development Bank (ADB) Board of Governors to be held in Manila.</p><p>Finance Secretary Carlos Dominguez III has tapped DTI Assistant Secretary Arturo Boncato Jr. as a key resource person of the DOF for Manila\'s hosting of the 51st Annual Meeting of the ADB Board of Governors on May 3–6 next year.</p><p>Boncato, who heads the DTI\'s Competitiveness and Ease of Doing Business Group, was formerly Assistant Secretary of the Department of Tourism in the Aquino administration in charge of handling special projects for Mindanao, such as the Philippine Halal Tourism Project. He was at that time also the tourism department\'s alternate spokesperson.</p><p>He had also chaired the Brunei, Indonesia Malaysia, the Philippines-East ASEAN Growth Area (BIMP-EAGA) Tourism Cluster and was Representative to the Bangsamoro Transition Committee.</p><p>Boncato is currently the supervising executive of the DTI\'s Competitiveness Bureau, E-Commerce, and BIMP-EAGA teams.</p><p>A former entrepreneur and hotelier, Boncato holds a Bachelor of Arts Degree in Mass Communications from the University of the Philippines.</p><p>Dominguez chairs the ADB Board of Governors.</p><p>The ADB is headquartered at the Ortigas Business Center in Mandaluyong City.</p><p><em>— Department of Finance</em></p><p><em>Originally published July 5, 2017 on the <a href="https://www.dof.gov.ph/dof-taps-dti-marketing-expert-for-2018-adb-meeting-in-manila/" target="_blank" rel="noopener noreferrer">Department of Finance</a>.</em></p><p><a href="https://www.dof.gov.ph/dof-taps-dti-marketing-expert-for-2018-adb-meeting-in-manila/" target="_blank" rel="noopener noreferrer">Read the full article on DOF.gov.ph</a></p>',
                'featured_image_url' => Assets::url('/images/services/mice-management.jpg?v=2'),
                'status' => 'published',
                'is_featured' => true,
                'reading_time' => 3,
                'published_at' => now()->subMinutes(15),
                'seo_title' => 'DOF Taps DTI Marketing Expert for 2018 ADB Meeting | Art Boncato',
                'seo_description' => 'Department of Finance announcement on Arturo Boncato Jr. supporting preparations for the 2018 ADB Board of Governors meeting in Manila.',
            ]
        );

        Post::query()->updateOrCreate(
            ['slug' => 'art-boncato-jr-world-trade-center-metro-manila-2023'],
            [
                'post_category_id' => $mediaCategory?->id,
                'author_id' => $admin->id,
                'title' => 'Art Boncato, Jr moves to World Trade Center Metro Manila',
                'excerpt' => 'Art Boncato Jr. has joined World Trade Center Metro Manila as chief operating officer and executive vice president, following his tenure as Department of Tourism undersecretary.',
                'content' => '<p>Art Boncato, Jr has joined the World Trade Center Metro Manila as chief operating officer and executive vice president.</p><p>He was previously the Philippine Department of Tourism undersecretary for tourism regulation, coordination and resource generation.</p><p><em>— TTGmice</em></p><p><em>Originally published March 20, 2023 on <a href="https://www.ttgmice.com/2023/03/20/art-boncato-jr-moves-to-world-trade-center-metro-manila/" target="_blank" rel="noopener noreferrer">TTGmice</a>.</em></p><p><a href="https://www.ttgmice.com/2023/03/20/art-boncato-jr-moves-to-world-trade-center-metro-manila/" target="_blank" rel="noopener noreferrer">Read the full article on TTGmice</a></p>',
                'featured_image_url' => Assets::url('/images/posts/art-boncato-wtcmm-appointment.png'),
                'status' => 'published',
                'is_featured' => true,
                'reading_time' => 2,
                'published_at' => now()->subMinutes(5),
                'seo_title' => 'Art Boncato Jr Joins World Trade Center Metro Manila | TTGmice',
                'seo_description' => 'TTGmice reports on Art Boncato Jr.\'s appointment as COO and executive vice president of World Trade Center Metro Manila.',
            ]
        );

        Post::query()->updateOrCreate(
            ['slug' => 'megaworld-hotels-resorts-new-appointments-2024'],
            [
                'post_category_id' => $mediaCategory?->id,
                'author_id' => $admin->id,
                'title' => 'Megaworld Hotels and Resorts announces new appointments',
                'excerpt' => 'Megaworld Hotels and Resorts has named Art Boncato Jr as group general manager, following his tenure as executive vice president and chief operating officer of World Trade Center Metro Manila.',
                'content' => '<p>Megaworld Hotels and Resorts has named Art Boncato Jr as group general manager. Boncato used to be executive vice president and chief operating officer of World Trade Center Metro Manila.</p><p>Joe Fijardo is now general manager of 1,500-key Grand Westside Hotel Manila which is opening in June. Oliver Esguerra replaced Fijardo as general manager of Kingsford Hotel Manila.</p><p>Maia Israel has taken over from Elmar Lima as general manager of Belmont Boracay. She worked under various capacities in Song Saa Private Island in Cambodia, Courtyard by Marriott Philippines, Laucala Island in Fiji and Radisson Blu Fiji.</p><p><em>— TTGmice</em></p><p><em>Originally published April 2, 2024 on <a href="https://www.ttgmice.com/2024/04/02/megaworld-hotels-and-resorts-announces-new-appointments/" target="_blank" rel="noopener noreferrer">TTGmice</a>.</em></p><p><a href="https://www.ttgmice.com/2024/04/02/megaworld-hotels-and-resorts-announces-new-appointments/" target="_blank" rel="noopener noreferrer">Read the full article on TTGmice</a></p>',
                'featured_image_url' => Assets::url('/images/posts/megaworld-art-boncato-appointment.png'),
                'status' => 'published',
                'is_featured' => true,
                'reading_time' => 2,
                'published_at' => now()->subMinutes(5),
                'seo_title' => 'Megaworld Hotels and Resorts Appointments | Art Boncato | TTGmice',
                'seo_description' => 'TTGmice reports on Art Boncato Jr\'s appointment as group general manager of Megaworld Hotels and Resorts.',
            ]
        );

        Post::query()->updateOrCreate(
            ['slug' => 'northern-mindanao-philippine-tourism-awards-2025'],
            [
                'post_category_id' => $strategyCategory?->id,
                'author_id' => $admin->id,
                'title' => 'Northern Mindanao shines at 1st Philippine Tourism Awards',
                'excerpt' => 'Northern Mindanao stood out at the inaugural Philippine Tourism Awards at Okada Manila, with Camiguin, Proforg, The VIP Hotel, De Luxe Hotel, and Chali Resort and Conference Center bringing home national honors.',
                'content' => '<p><strong>PROGRESS WATCH: Metro Cagayan de Oro and Northern Mindanao</strong></p><figure class="my-8 overflow-hidden rounded-2xl"><img src="/images/posts/philippine-tourism-awards-collage.jpg" alt="Northern Mindanao awardees at the 1st Philippine Tourism Awards" class="w-full" loading="lazy" /></figure><p>Northern Mindanao proudly stood out at the 1st Philippine Tourism Awards held on September 8, 2025, at Okada Manila, as several homegrown names brought home prestigious recognitions. Among the awardees were the Province of Camiguin, Professional Organizers Unlimited, VIP Hotel, De Luxe Hotel, and Chali Beach Resort, each honored in their respective categories. These accolades reaffirm the region\'s rising reputation as a prime destination for leisure, business, and sustainable travel in the Philippines. Congratulations to all awardees!</p><p>The Province of Camiguin received the Ecotourism Destination Award for Mantigue Island, solidifying its reputation as one of the country\'s premier nature destinations. Camiguin Provincial Tourism Officer Candice Dael is shown with the award.</p><figure class="my-8 overflow-hidden rounded-2xl"><img src="/images/posts/philippine-tourism-awards-camiguin-mantigue.jpg" alt="Camiguin Provincial Tourism Officer Candice Dael receives the Ecotourism Destination Award for Mantigue Island" class="w-full" loading="lazy" /></figure><p>Cagayan de Oro-based Professional Organizers Unlimited, Inc. (Proforg) was also honored with the Tourism Excellence Award for MICE Organizer, highlighting its contribution to business events and conferences in the region. Proforg Managing Director Helen Uy (2nd from right) is shown receiving the award.</p><figure class="my-8 overflow-hidden rounded-2xl"><img src="/images/posts/philippine-tourism-awards-group-stage.png" alt="Professional Organizers Unlimited receives the Tourism Excellence Award for MICE Organizer" class="w-full" loading="lazy" /></figure><p>For the Tourism Pillar Award – Enterprise, three iconic Cagayan de Oro hotels and resorts—The VIP Hotel, De Luxe Hotel, and Chali Resort and Conference Center—were recognized for their decades of service. Receiving their respective awards were The VIP Hotel General Manager, De Luxe Hotel General Manager Jeffrey Limbonhai, and Chali Resort General Manager Ging Chaves.</p><figure class="my-8 overflow-hidden rounded-2xl"><img src="/images/posts/philippine-tourism-awards-hotels.png" alt="Tourism Pillar Award recipients from Cagayan de Oro hotels and resorts" class="w-full" loading="lazy" /></figure><figure class="my-8 overflow-hidden rounded-2xl"><img src="/images/posts/philippine-tourism-awards-group-finale.png" alt="Northern Mindanao awardees with Tourism Regional Director Marie Elaine Salvaña Unchuan" class="w-full" loading="lazy" /></figure><p>The awardees from Northern Mindanao pose together with Tourism Regional Director Marie Elaine Salvaña Unchuan.</p><p><em>Photos by the Department of Tourism.</em></p><p><em>Originally published September 9, 2025 on <a href="https://metrocdodev.com/2025/09/09/northern-mindanao-shines-at-1st-philippine-tourism-awards/" target="_blank" rel="noopener noreferrer">MetroCDODev.com</a>.</em></p><p><a href="https://metrocdodev.com/2025/09/09/northern-mindanao-shines-at-1st-philippine-tourism-awards/" target="_blank" rel="noopener noreferrer">Read the full article on MetroCDODev.com</a></p>',
                'featured_image_url' => Assets::url('/images/posts/philippine-tourism-awards-collage.jpg'),
                'status' => 'published',
                'is_featured' => true,
                'reading_time' => 4,
                'published_at' => now()->subMinutes(5),
                'seo_title' => 'Northern Mindanao Philippine Tourism Awards 2025 | Art Boncato',
                'seo_description' => 'Camiguin, Cagayan de Oro hotels, and Proforg honored at the 1st Philippine Tourism Awards in Okada Manila.',
            ]
        );

        Post::query()->updateOrCreate(
            ['slug' => 'camiguin-isle-be-there-tourism-campaign'],
            [
                'post_category_id' => $strategyCategory?->id,
                'author_id' => $admin->id,
                'title' => 'Camiguin launches \'Isle be There\' tourism campaign',
                'excerpt' => 'Camiguin rolled out its "Isle be There" rebranding theme to welcome tourists with a fresh post-pandemic start, backed by Smart Tourism, a PHP250-million Mantigue Island plan, and updated visitor guidelines.',
                'content' => '<figure class="my-8 overflow-hidden rounded-2xl"><img src="/images/posts/camiguin-isle-be-there-campaign.png" alt="Camiguin Isle be There tourism campaign branding" class="w-full max-w-md mx-auto" loading="lazy" /></figure><p><strong>CAGAYAN DE ORO CITY</strong> – The Camiguin provincial government rolled out Friday its "Isle be There" rebranding theme to welcome tourists with a fresh start from the coronavirus disease 2019 pandemic.</p><p>Gov. Xavier Jesus Romualdo said the new tourism slogan is part of the provincial government\'s transformation and development plans, with communities and establishments cooperating for its success.</p><p>"We are also going for the digitalization, to have \'Smart Tourism\' where tourists can enjoy the island (with ease)," Romualdo said during the opening program.</p><p>With the use of technology, the governor said visitors can be given ample service and security throughout their stay in the island province.</p><p>Since January, the governor said the province has received 800,000 tourists and expects to reach a million by 2025.</p><p>Romualdo also bared the PHP250-million worth Mantigue Island Tourism Plan, which aims to improve the facilities for water and power, waste management, docking and mooring, guest services and amenities, safety and security and emergency response.</p><p>Another highlight of Camiguin\'s tourism campaign is the lowering of restrictions on tourists who have not availed of Covid-19 vaccines.</p><p>Under the new directives, unvaccinated tourists can visit the island provided that they present a negative Covid-19 test taken in the last two days from a Department of Health-accredited clinic or testing center.</p><p>Unvaccinated minors aged 11 and below are no longer requested for test results.</p><p><em>— Nef Luczon, Philippine News Agency</em></p><p><em>Originally published March 17, 2023 on the <a href="https://www.pna.gov.ph/articles/1197643" target="_blank" rel="noopener noreferrer">Philippine News Agency</a>.</em></p><p><a href="https://www.pna.gov.ph/articles/1197643" target="_blank" rel="noopener noreferrer">Read the full article on PNA.gov.ph</a></p>',
                'featured_image_url' => Assets::url('/images/posts/camiguin-isle-be-there-campaign.png'),
                'status' => 'published',
                'is_featured' => true,
                'reading_time' => 3,
                'published_at' => now(),
                'seo_title' => 'Camiguin Isle be There Tourism Campaign | Philippine News Agency',
                'seo_description' => 'Camiguin launches its Isle be There tourism rebranding with Smart Tourism, Mantigue Island development, and post-pandemic visitor guidelines.',
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
