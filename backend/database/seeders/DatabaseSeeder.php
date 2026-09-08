<?php

namespace Database\Seeders;

use App\Models\HomepageSection;
use App\Support\Assets;
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
            ['key' => 'site_name', 'value' => 'Art!', 'type' => 'string', 'group' => 'general'],
            ['key' => 'site_tagline', 'value' => 'Boncato Tourism Consultancy', 'type' => 'string', 'group' => 'general'],
            ['key' => 'tagline', 'value' => 'Boncato Tourism Consultancy', 'type' => 'string', 'group' => 'general'],
            ['key' => 'contact_email', 'value' => 'atm@artourismedia.com', 'type' => 'string', 'group' => 'contact'],
            ['key' => 'contact_phone', 'value' => '+63 917 123 4567', 'type' => 'string', 'group' => 'contact'],
            ['key' => 'contact_address', 'value' => 'Philippines', 'type' => 'string', 'group' => 'contact'],
            ['key' => 'footer_text', 'value' => '© Art! Boncato Tourism Consultancy. Creating destinations people remember.', 'type' => 'string', 'group' => 'general'],
            ['key' => 'newsletter_title', 'value' => 'Stay Connected', 'type' => 'string', 'group' => 'general'],
            ['key' => 'newsletter_description', 'value' => 'Get destination strategy insights delivered to your inbox.', 'type' => 'string', 'group' => 'general'],
            ['key' => 'footer_description', 'value' => 'We partner with governments, communities, and investors to design tourism experiences that leave lasting impressions.', 'type' => 'string', 'group' => 'footer'],
            ['key' => 'footer_tagline', 'value' => 'Creating destinations people remember.', 'type' => 'string', 'group' => 'footer'],
            ['key' => 'footer_copyright', 'value' => '© Art! Boncato Tourism Consultancy. All rights reserved.', 'type' => 'string', 'group' => 'footer'],
            ['key' => 'footer_email', 'value' => 'atm@artourismedia.com', 'type' => 'string', 'group' => 'footer'],
            ['key' => 'footer_phone', 'value' => '+63 917 123 4567', 'type' => 'string', 'group' => 'footer'],
            ['key' => 'footer_address', 'value' => 'Philippines', 'type' => 'string', 'group' => 'footer'],
            ['key' => 'primary_color', 'value' => '#078C95', 'type' => 'string', 'group' => 'branding'],
            ['key' => 'secondary_color', 'value' => '#FF5A1F', 'type' => 'string', 'group' => 'branding'],
            ['key' => 'accent_color', 'value' => '#0B2447', 'type' => 'string', 'group' => 'branding'],
            ['key' => 'google_analytics_id', 'value' => '', 'type' => 'string', 'group' => 'branding'],
            ['key' => 'default_seo_title', 'value' => 'Art! Boncato | Tourism Consultancy', 'type' => 'string', 'group' => 'branding'],
            ['key' => 'default_seo_description', 'value' => 'Art Boncato Tourism Consultancy helps governments and communities shape inspiring destinations people remember.', 'type' => 'string', 'group' => 'branding'],
            ['key' => 'logo_url', 'value' => Assets::url('/images/brand/logo-header-v2.png'), 'type' => 'string', 'group' => 'branding'],
            ['key' => 'favicon_url', 'value' => Assets::url('/favicon.svg'), 'type' => 'string', 'group' => 'branding'],
        ];

        foreach ($settings as $setting) {
            SiteSetting::query()->updateOrCreate(['key' => $setting['key']], $setting);
        }
    }

    protected function seedNavigation(): void
    {
        $items = [
            ['label' => 'About', 'url' => '/about', 'sort_order' => 1],
            ['label' => 'Services', 'url' => '/services', 'sort_order' => 2],
            ['label' => 'Projects', 'url' => '/projects', 'sort_order' => 3],
            ['label' => 'Insights', 'url' => '/insights', 'sort_order' => 4],
            ['label' => 'Schedule a Consultation', 'url' => '/contact', 'sort_order' => 5, 'is_cta' => true],
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
                    'image_url' => Assets::url('/images/hero/hero-slideshow-01-pamulak.jpg'),
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
                    'body' => '<p>For over 30 years, Art Boncato has shaped tourism and hospitality through strategic leadership, destination development, and national tourism initiatives—driving sustainable growth and creating opportunities for communities across the Philippines, especially Mindanao.</p>',
                    'cta_text' => 'More About Art',
                    'cta_url' => '/about',
                    'image_url' => Assets::url('/images/about/art-boncato-portrait.jpg'),
                    'image_alt' => 'Art Boncato professional portrait',
                ],
                'sort_order' => 3,
            ],
            [
                'type' => 'services',
                'title' => 'Services',
                'content' => [
                    'eyebrow' => 'Our Services',
                    'title' => 'End-to-end solutions for',
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
                'image_url' => Assets::url('/images/services/tourism-planning.svg'),
                'sort_order' => 1,
            ],
            [
                'slug' => 'destination-branding-marketing',
                'title' => 'Destination Branding and Marketing',
                'description' => 'Everything we do is based on understanding the story and identity of a destination. We help host communities articulate the ideals and reputation of the place we work with. Then we strategically communicate these.',
                'content' => '<p>We underline the significance of stakeholder buy-in as an essential step in the process.</p><h3>Projects and Experience:</h3><ul><li>Isle Be There Marketing Plan 2024, 2025, 2026</li><li>Camiguin Isle Be There Branding 2024</li><li>Clean Camiguin Marketing Plan 2021, 2022, 2023</li><li>Clean Camiguin Branding 2021</li></ul>',
                'category' => 'Marketing',
                'icon' => 'destination-branding',
                'image_url' => Assets::url('/images/services/tourism-planning.svg'),
                'sort_order' => 2,
            ],
            [
                'slug' => 'mice-management',
                'title' => 'MICE Management',
                'description' => 'Events delivery is one of the primary services our group provides. We have at least a generation of expertise in planning, organizing, and execution of Meetings, Incentives, Convention and Exhibitions (MICE) regionally and nationwide.',
                'content' => '<p>This main service also includes consulting and actual facility management and specialist manufacturing for exhibits.</p><h3>Projects and Experience:</h3><ul><li>Camiguin International Convention Center (conceptual stage)</li><li>ASEAN Tourism Forum (ATF) and ASEAN Summit Opening Ceremonies 2026 at The Mactan Expo (coordination team member for Megaworld Hotels and Resorts)</li><li>World Trade Center Metro Manila (senior leadership) 2022-2024</li><li>Iloilo MICE Situation Report and Marketing Plan (for the Department of Tourism) 2019</li><li>50th Asian Development Bank Summit 2018 (official Philippine government lead organizer with the ADB)</li><li>Kadayawan Festival 2016 (Co-chairman of Mayor Sara Duterte-Carpio)</li><li>ASEAN Tourism Forum (ATF) 2006 (Co-Chairman of Mayor Rodrigo R. Duterte, Davao Organizing Committee)</li><li>Conventions and Events Organizers, Inc. 1995-2001 (organized at least 70 local and regional MICE projects as lone Mindanao Professional Convention Organizer accredited by the Philippine Convention and Visitors Corporation now named Tourism Promotions Board)</li></ul>',
                'category' => 'MICE',
                'icon' => 'mice-events',
                'image_url' => Assets::url('/images/services/tourism-planning.svg'),
                'sort_order' => 3,
            ],
            [
                'slug' => 'thought-leadership-learning-development',
                'title' => 'Thought Leadership, Learning and Development',
                'description' => 'We work with partners to become trusted authority and respected expert source of knowledge in the tourism industry. We likewise collaborate with organizations that promote internationally acknowledged hospitality service quality in destinations.',
                'content' => '<p>This is accomplished by creating and utilizing tools that deal with problems affecting a skilled workforce in the hospitality sector.</p><h3>Projects and Experience</h3><ul><li>Camiguin Roundtable on Sustainable Island Destination Governance (September 2026)</li><li>Camiguin Tourism Training Institute (conceptual stage)</li></ul>',
                'category' => 'Learning',
                'icon' => 'learning-leadership',
                'image_url' => Assets::url('/images/services/tourism-planning.svg'),
                'sort_order' => 4,
            ],
            [
                'slug' => 'mindanao-connect',
                'title' => 'Mindanao CONNECT',
                'description' => 'Our group is an active player in the island\'s network of destinations and tourism sector leaders.',
                'content' => '<p>Make Mindanao your next greenfield. Let us help you in this.</p><h3>Projects and Experience</h3><ul><li>Mindanao Tourism Situation Report ( for crafting haha)</li><li>Mindanao Roadtrip with Art videos</li><li>Mindanao Fun 101 magazine digital file</li></ul>',
                'category' => 'Regional',
                'icon' => 'mindanao-connect',
                'image_url' => Assets::url('/images/services/tourism-planning.svg'),
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
        $heritageCategory = ProjectCategory::query()->where('slug', 'cultural-heritage')->first();

        Project::query()->updateOrCreate(
            ['slug' => 'camiguin-tourism-master-plan'],
            [
                'project_category_id' => $islandCategory?->id,
                'title' => 'Camiguin Tourism Master Plan',
                'excerpt' => 'A comprehensive master plan guiding sustainable growth for Camiguin\'s island destination.',
                'content' => '<p>Art Boncato led stakeholder workshops and produced a 10-year tourism master plan balancing conservation, community livelihoods, and visitor growth for Camiguin Island.</p>',
                'cover_image_url' => Assets::url('/images/projects/camiguin.png'),
                'category_label' => 'Strategy & Planning',
                'is_featured' => true,
                'is_published' => true,
                'sort_order' => 1,
                'color' => '#078C95',
            ]
        );

        Project::query()->updateOrCreate(
            ['slug' => 'provincial-destination-branding'],
            [
                'project_category_id' => $heritageCategory?->id,
                'title' => 'Destination Branding for Provincial Tourism',
                'excerpt' => 'A unified brand platform and campaign toolkit for a provincial tourism office.',
                'content' => '<p>We developed a distinctive destination identity, visual system, and launch campaign that increased off-peak visitation across the province\'s key corridors.</p>',
                'cover_image_url' => Assets::url('/images/projects/provincial-branding.png'),
                'category_label' => 'Branding & Marketing',
                'is_featured' => true,
                'is_published' => true,
                'sort_order' => 2,
                'color' => '#FF5A1F',
            ]
        );

        Project::query()->updateOrCreate(
            ['slug' => 'international-promotion-campaign'],
            [
                'project_category_id' => $islandCategory?->id,
                'title' => 'International Promotion Campaign',
                'excerpt' => 'A multi-market campaign bringing Philippine destinations to global audiences.',
                'content' => '<p>From content production to trade engagement, we delivered an integrated international promotion program that expanded reach across key source markets.</p>',
                'cover_image_url' => Assets::url('/images/projects/international-campaign.png'),
                'category_label' => 'Media & Promotion',
                'is_featured' => true,
                'is_published' => true,
                'sort_order' => 3,
                'color' => '#0B2447',
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
    }

    protected function seedPages(): void
    {
        Page::query()->updateOrCreate(
            ['slug' => 'about'],
            [
                'title' => 'About Destination Studio',
                'content' => '<p>Destination Studio is a tourism consultancy helping places tell better stories, welcome more visitors, and grow responsibly. Our multidisciplinary team combines strategy, creative, and analytics to deliver measurable impact for destinations across the Philippines and Southeast Asia.</p>',
                'metadata' => [
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
                            'avatar_url' => Assets::url('/images/team/maria-santos.png'),
                        ],
                        [
                            'name' => 'James Rivera',
                            'role' => 'Head of Strategy',
                            'bio' => 'Former tourism board advisor specializing in visitor experience and stakeholder engagement.',
                            'avatar_url' => Assets::url('/images/team/james-rivera.png'),
                        ],
                        [
                            'name' => 'Elena Cruz',
                            'role' => 'Creative Director',
                            'bio' => 'Award-winning brand strategist for heritage cities and coastal destination campaigns.',
                            'avatar_url' => Assets::url('/images/team/elena-cruz.png'),
                        ],
                    ],
                ],
                'is_published' => true,
                'seo_title' => 'About Us | Destination Studio',
                'seo_description' => 'Meet the team behind Destination Studio, a strategic tourism consultancy for destinations.',
            ]
        );

        Page::query()->updateOrCreate(
            ['slug' => 'privacy-policy'],
            [
                'title' => 'Privacy Policy',
                'content' => '<p>Destination Studio respects your privacy. This policy explains how we collect, use, and protect personal information submitted through our website and consultation forms.</p>',
                'is_published' => true,
            ]
        );

        Page::query()->updateOrCreate(
            ['slug' => 'terms-of-use'],
            [
                'title' => 'Terms of Use',
                'content' => '<p>By using the Destination Studio website, you agree to these terms. Content is provided for informational purposes and does not constitute professional advice without a signed engagement.</p>',
                'is_published' => true,
                'seo_title' => 'Terms of Use | Destination Studio',
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
