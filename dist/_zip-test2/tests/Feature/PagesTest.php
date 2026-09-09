<?php

namespace Tests\Feature;

use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PagesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_terms_of_use_page_is_public(): void
    {
        $response = $this->getJson('/api/pages/terms-of-use');

        $response->assertOk()
            ->assertJsonPath('data.slug', 'terms-of-use')
            ->assertJsonPath('data.title', 'Terms of Use');
    }
}
