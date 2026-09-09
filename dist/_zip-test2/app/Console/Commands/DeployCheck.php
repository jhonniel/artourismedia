<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Storage;

class DeployCheck extends Command
{
    protected $signature = 'deploy:check';

    protected $description = 'Validate environment and infrastructure before deployment';

    public function handle(): int
    {
        $this->info('Running deployment readiness checks...');
        $failed = false;
        $isProduction = config('app.env') === 'production';

        $requiredEnv = [
            'APP_KEY' => config('app.key'),
            'APP_URL' => config('app.url'),
            'DB_CONNECTION' => config('database.default'),
            'FRONTEND_URL' => config('app.frontend_url'),
            'ADMIN_URL' => config('app.admin_url'),
        ];

        foreach ($requiredEnv as $key => $value) {
            if (blank($value)) {
                $this->error("Missing required env: {$key}");
                $failed = true;
            } else {
                $this->line("✓ {$key}");
            }
        }

        if (config('app.debug') && $isProduction) {
            $this->warn('APP_DEBUG is enabled in production');
            $failed = true;
        }

        if ($isProduction && in_array(env('ADMIN_PASSWORD'), ['password', 'secret', 'changeme'], true)) {
            $this->warn('Default or weak ADMIN_PASSWORD detected in production');
            $failed = true;
        }

        if ($isProduction && config('mail.default') === 'log') {
            $this->warn('MAIL_MAILER is set to log in production');
            $failed = true;
        }

        if ($isProduction && config('mail.default') === 'resend' && blank(config('services.resend.key'))) {
            $this->warn('RESEND_API_KEY is missing but MAIL_MAILER is set to resend');
            $failed = true;
        }

        if (in_array(config('filesystems.default'), ['spaces', 's3'], true)) {
            $spacesRequired = [
                'DIGITALOCEAN_SPACES_KEY' => config('spaces.key'),
                'DIGITALOCEAN_SPACES_SECRET' => config('spaces.secret'),
                'DIGITALOCEAN_SPACES_BUCKET' => config('spaces.bucket'),
                'DIGITALOCEAN_SPACES_ENDPOINT' => config('spaces.endpoint'),
                'DIGITALOCEAN_SPACES_PATH' => config('spaces.url'),
            ];

            foreach ($spacesRequired as $key => $value) {
                if (blank($value)) {
                    $this->error("Missing required Spaces env: {$key}");
                    $failed = true;
                } else {
                    $this->line("✓ {$key}");
                }
            }

            if (filled(config('spaces.root'))) {
                $this->line('✓ Spaces root: '.config('spaces.root'));
            }
        }

        try {
            DB::connection()->getPdo();
            $this->line('✓ Database connection');
        } catch (\Throwable $e) {
            $this->error('Database connection failed');
            $failed = true;
        }

        if ($this->usesRedis()) {
            try {
                Redis::connection()->ping();
                $this->line('✓ Redis connection');
            } catch (\Throwable $e) {
                $this->error('Redis connection failed');
                $failed = true;
            }
        }

        try {
            Storage::disk(config('filesystems.default'))->put('deploy-check.txt', 'ok');
            Storage::disk(config('filesystems.default'))->delete('deploy-check.txt');
            $this->line('✓ Storage disk: '.config('filesystems.default'));
        } catch (\Throwable $e) {
            $this->error('Storage check failed');
            $failed = true;
        }

        $storagePath = storage_path('logs');
        if (! is_writable($storagePath)) {
            $this->error('storage/logs is not writable');
            $failed = true;
        } else {
            $this->line('✓ storage/logs writable');
        }

        if (! File::exists(base_path('vendor/autoload.php'))) {
            $this->error('Composer dependencies not installed');
            $failed = true;
        } else {
            $this->line('✓ Composer dependencies');
        }

        Artisan::call('route:list', ['--path' => 'api/health']);
        if (! str_contains(Artisan::output(), 'api/health')) {
            $this->error('Health route not registered');
            $failed = true;
        } else {
            $this->line('✓ Health route registered');
        }

        $failed = $this->checkSpaAssets('public/index.html', 'Website') || $failed;
        $failed = $this->checkSpaAssets('public/admin/index.html', 'Admin') || $failed;

        if ($failed) {
            $this->newLine();
            $this->error('Deployment check failed. Fix the issues above before going live.');

            return self::FAILURE;
        }

        $this->newLine();
        $this->info('All deployment checks passed.');

        return self::SUCCESS;
    }

    protected function usesRedis(): bool
    {
        return in_array(config('cache.default'), ['redis'], true)
            || in_array(config('queue.default'), ['redis'], true)
            || in_array(config('session.driver'), ['redis'], true);
    }

    protected function checkSpaAssets(string $relativePath, string $label): bool
    {
        $path = base_path($relativePath);

        if (! File::exists($path)) {
            $this->warn("{$label} SPA missing: {$relativePath}");

            return false;
        }

        $html = File::get($path);
        preg_match_all('/(?:src|href)="(\/assets\/[^"?]+)"/', $html, $matches);
        $assets = array_unique($matches[1] ?? []);
        $missing = [];

        foreach ($assets as $asset) {
            if (! File::exists(public_path(ltrim($asset, '/')))) {
                $missing[] = $asset;
            }
        }

        if ($missing !== []) {
            $this->error("{$label} index.html references missing files:");
            foreach ($missing as $asset) {
                $this->line("  - {$asset}");
            }
            $this->line('  Redeploy the full web-deploy.zip (or replace public/assets + index.html together).');

            return true;
        }

        $this->line("✓ {$label} SPA assets match index.html");

        return false;
    }
}
