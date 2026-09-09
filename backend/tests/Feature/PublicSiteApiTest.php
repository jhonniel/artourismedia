<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicSiteApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_site_endpoint_returns_json_arrays_not_php_objects(): void
    {
        $this->seed();

        $response = $this->getJson('/api/site');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'data' => [
                    'settings',
                    'navigation',
                    'footer',
                    'social_links',
                ],
            ]);

        $navigation = $response->json('data.navigation');
        $this->assertIsArray($navigation);
        $this->assertArrayNotHasKey('__PHP_Incomplete_Class_Name', $response->json('data'));

        $cached = cache()->get('api.site');
        $this->assertIsArray($cached);
        $this->assertIsArray($cached['navigation'] ?? null);
        $this->assertStringNotContainsString(
            '__PHP_Incomplete_Class',
            json_encode($cached) ?: '',
        );
    }

    public function test_site_endpoint_rebuilds_corrupted_cache(): void
    {
        $this->seed();

        cache()->put('api.site', [
            'settings' => ['site_name' => 'Broken'],
            'navigation' => ['__PHP_Incomplete_Class_Name' => 'AnonymousResourceCollection'],
            'footer' => [],
            'social_links' => [],
        ], 300);

        $response = $this->getJson('/api/site');

        $response->assertOk()
            ->assertJsonPath('success', true);

        $navigation = $response->json('data.navigation');
        $this->assertIsArray($navigation);
        $this->assertNotEmpty($navigation);
        $this->assertArrayHasKey('label', $navigation[0]);
    }

    public function test_homepage_endpoint_returns_sections_array(): void
    {
        $this->seed();

        $response = $this->getJson('/api/homepage');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'data' => [
                    'sections',
                    'services',
                    'featured_projects',
                    'latest_posts',
                ],
            ]);

        $sections = $response->json('data.sections');
        $this->assertIsArray($sections);
        $this->assertNotEmpty($sections);
        $this->assertArrayNotHasKey('__PHP_Incomplete_Class_Name', $response->json('data'));

        $cached = cache()->get('api.homepage');
        $this->assertIsArray($cached);
        $this->assertIsArray($cached['sections'] ?? null);
        $this->assertStringNotContainsString(
            '__PHP_Incomplete_Class',
            json_encode($cached) ?: '',
        );
    }
}
