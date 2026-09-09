<?php

namespace App\Console\Commands;

use App\Services\MindanaoConnectVideoImportService;
use App\Support\YouTubeChannelFeed;
use Illuminate\Console\Command;

class ImportMindanaoConnectVideos extends Command
{
    protected $signature = 'mindanao-connect:import-videos
                            {--channel-id= : YouTube channel ID (defaults to Mindanao Roadtrip with Art)}';

    protected $description = 'Import YouTube videos from the Mindanao Roadtrip with Art channel into Mindanao CONNECT';

    public function handle(MindanaoConnectVideoImportService $importService): int
    {
        $channelId = $this->option('channel-id') ?: YouTubeChannelFeed::MINDANAO_ROADTRIP_CHANNEL_ID;

        $this->info("Importing videos from channel {$channelId}...");

        $result = $importService->importFromChannel($channelId);

        if ($result['imported'] > 0) {
            $this->info("Added {$result['imported']} new video(s) from the channel.");
        }

        $this->info("Done. {$result['total']} videos synced ({$result['imported']} new, {$result['updated']} updated).");

        return self::SUCCESS;
    }
}
