<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Config;
use Tests\TestCase;

class DeployCheckTest extends TestCase
{
    use RefreshDatabase;

    public function test_deploy_check_passes_in_testing_environment(): void
    {
        $exitCode = Artisan::call('deploy:check');

        if ($exitCode !== 0) {
            $this->fail(Artisan::output());
        }

        $this->assertSame(0, $exitCode);
    }

    public function test_security_headers_are_applied_in_production(): void
    {
        Config::set('app.env', 'production');

        $response = $this->getJson('/api/health');

        $response->assertOk()
            ->assertHeader('X-Content-Type-Options', 'nosniff')
            ->assertHeader('X-Frame-Options', 'SAMEORIGIN')
            ->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    }

    public function test_security_headers_are_not_applied_outside_production(): void
    {
        Config::set('app.env', 'testing');

        $response = $this->getJson('/api/health');

        $response->assertOk()
            ->assertHeaderMissing('X-Frame-Options');
    }
}
