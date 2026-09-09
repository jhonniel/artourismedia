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
    }
}
