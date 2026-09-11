<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Finder\Finder;

class UploadStaticAssets extends Command
{
    protected $signature = 'assets:upload-static
                            {--source= : Directory to upload (default: repo frontend/public/images)}
                            {--dry-run : List files without uploading}';

    protected $description = 'Upload static site images to DigitalOcean Spaces (excludes mockups and unused hero files)';


    public function handle(): int
    {
        $source = $this->option('source')
            ?: base_path('../frontend/public/images');

        $source = realpath($source);

        if ($source === false || ! is_dir($source)) {
            $this->error('Source directory not found.');

            return self::FAILURE;
        }

        $prefix = config('assets.spaces_prefix');
        $disk = Storage::disk('spaces');
        $dryRun = (bool) $this->option('dry-run');

        $finder = Finder::create()
            ->files()
            ->in($source)
            ->sortByName();

        $uploaded = 0;
        $skipped = 0;

        foreach ($finder as $file) {
            $relative = str_replace('\\', '/', substr($file->getPathname(), strlen($source) + 1));

            if ($this->shouldSkip($relative)) {
                $skipped++;
                continue;
            }

            $remotePath = $prefix.'/images/'.$relative;
            $mime = $this->guessMime($file->getExtension());

            if ($dryRun) {
                $this->line("  would upload: {$relative} → {$remotePath}");
                $uploaded++;
                continue;
            }

            $disk->put($remotePath, file_get_contents($file->getPathname()), [
                'visibility' => 'public',
                'ContentType' => $mime,
            ]);

            $this->line("  uploaded: {$relative}");
            $uploaded++;
        }

        // Favicons at site root
        foreach (['favicon.png', 'favicon-192.png', 'apple-touch-icon.png'] as $faviconName) {
            $favicon = realpath(base_path('../frontend/public/'.$faviconName));
            if ($favicon === false || ! is_file($favicon)) {
                continue;
            }

            $remotePath = $prefix.'/'.$faviconName;
            if ($dryRun) {
                $this->line("  would upload: {$faviconName} → {$remotePath}");
            } else {
                $disk->put($remotePath, file_get_contents($favicon), [
                    'visibility' => 'public',
                    'ContentType' => 'image/png',
                ]);
                $this->line("  uploaded: {$faviconName}");
            }
            $uploaded++;
        }

        $baseUrl = config('assets.base_url');
        $this->newLine();
        $this->info($dryRun ? "Dry run: {$uploaded} file(s), {$skipped} skipped." : "Uploaded {$uploaded} file(s), skipped {$skipped} mockup/unused file(s).");

        if ($baseUrl !== '') {
            $this->line("Assets base URL: {$baseUrl}");
        } else {
            $this->warn('Set ASSETS_BASE_URL in .env to match your Spaces static prefix.');
        }

        return self::SUCCESS;
    }

    private function shouldSkip(string $relative): bool
    {
        $name = basename($relative);
        $dir = dirname($relative);

        if (str_starts_with($name, '_preview_')) {
            return true;
        }

        if (preg_match('/mockup|reference|user-reference/i', $name)) {
            return true;
        }

        if ($dir === 'hero' || str_ends_with($dir, '/hero')) {
            if (preg_match('/^hero-slide-\d+\.jpg$/i', $name)) {
                return true;
            }

            if (preg_match('/^hero-slideshow-\d+\.jpg$/i', $name)) {
                return true;
            }

            if (preg_match('/^hero-slideshow-\d{2}-.+\.jpg$/i', $name)) {
                return false;
            }

            if (preg_match('/^hero-(beach|composite|person|art|blob|scene|coastline|mockup|landing)/i', $name)) {
                return true;
            }
        }

        return false;
    }

    private function guessMime(string $ext): string
    {
        return match (strtolower($ext)) {
            'svg' => 'image/svg+xml',
            'png' => 'image/png',
            'jpg', 'jpeg' => 'image/jpeg',
            'webp' => 'image/webp',
            'gif' => 'image/gif',
            default => 'application/octet-stream',
        };
    }
}
