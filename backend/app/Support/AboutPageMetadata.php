<?php

namespace App\Support;

class AboutPageMetadata
{
    public static function defaults(): array
    {
        return [
            'eyebrow' => 'About Art Boncato',
            'headline' => 'Three Decades of Leadership in Tourism, Hospitality & Destination Development',
            'intro' => 'For over 30 years, Art Boncato has shaped tourism and hospitality through strategic leadership, destination development, and national tourism initiatives—driving sustainable growth and creating opportunities for communities across the Philippines, especially Mindanao.',
            'portrait_url' => '/images/about/art-boncato-portrait.jpg?v=14',
            'landscape_url' => '/images/hero/hero-slideshow-19-mountain-valley.jpg',
            'signature_name' => 'Art Boncato, Jr.',
            'signature_title' => 'Tourism & Hospitality Executive',
            'quote' => 'Tourism creates opportunities, connects people, and builds stronger communities.',
            'career_heading' => 'A Career Built Around Tourism',
            'career_body' => '<p>Art Boncato, Jr. is a tourism and hospitality executive who continues to build on a career spanning 30 years.</p>'
                .'<p>He has spent the past 10 years in several senior leadership roles as the Group General Manager of Megaworld Hotels and Resorts; Executive Vice President and Chief Operating Officer of the World Trade Center Metro Manila; Regional Director, Assistant Secretary, and Undersecretary of the Philippine Department of Tourism; and Assistant Secretary of the Department of Trade and Industry seconded to the Department of Finance to organize the 51st Asian Development Bank Summit in Manila.</p>'
                .'<p>He is now steering ArTourisMedia, a team that delivers bespoke tourism solutions for planning and development, branding and marketing, learning and development, MICE execution, and a partner in advocating tourism growth in Mindanao.</p>',
            'leadership' => [
                ['title' => 'Group General Manager', 'organization' => 'Megaworld Hotels and Resorts'],
                ['title' => 'Executive Vice President & Chief Operating Officer', 'organization' => 'World Trade Center Metro Manila'],
                ['title' => 'Regional Director, Assistant Secretary, and Undersecretary', 'organization' => 'Philippine Department of Tourism'],
                ['title' => 'Assistant Secretary', 'organization' => 'Department of Trade and Industry (ADB Summit)'],
                ['title' => 'Tourism & Hospitality Executive', 'organization' => 'ArTourisMedia'],
            ],
            'expertise_heading' => 'Areas of Expertise',
            'expertise_description' => 'Bespoke tourism solutions spanning strategy, branding, events, learning, and Mindanao advocacy.',
            'expertise' => [
                [
                    'slug' => 'tourism-planning-development',
                    'title' => 'Tourism Planning and Development',
                    'description' => 'Master planning, ecotourism plans, and destination recovery planning for local economic growth.',
                ],
                [
                    'slug' => 'destination-branding-marketing',
                    'title' => 'Destination Branding and Marketing',
                    'description' => 'Place branding, marketing campaigns, and storytelling for host communities.',
                ],
                [
                    'slug' => 'mice-management',
                    'title' => 'MICE Management',
                    'description' => 'Meetings, incentives, conventions, and exhibitions delivered regionally and nationwide.',
                ],
                [
                    'slug' => 'thought-leadership-learning-development',
                    'title' => 'Thought Leadership, Learning and Development',
                    'description' => 'Workforce development and hospitality quality for destinations.',
                ],
                [
                    'slug' => 'mindanao-connect',
                    'title' => 'Mindanao CONNECT',
                    'description' => 'Network of Mindanao destination leaders and advocacy partners.',
                ],
            ],
            'closing_eyebrow' => 'Rooted in Mindanao',
            'closing_heading' => 'Connected to a Brighter Tomorrow',
            'closing_body' => 'Art Boncato continues to champion tourism growth in Mindanao—connecting people, places, and possibilities for communities across the island.',
            'closing_image_url' => '/images/hero/hero-slideshow-20-siargao-lagoon.jpg',
        ];
    }
}
