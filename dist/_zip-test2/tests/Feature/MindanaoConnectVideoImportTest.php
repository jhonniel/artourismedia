<?php

namespace Tests\Feature;

use App\Models\Service;
use App\Models\ServiceVideo;
use App\Support\YouTubeChannelFeed;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class MindanaoConnectVideoImportTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_import_command_syncs_channel_videos(): void
    {
        ServiceVideo::query()->delete();

        Http::fake([
            'www.youtube.com/feeds/videos.xml*' => Http::response(<<<'XML'
<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/" xmlns="http://www.w3.org/2005/Atom">
  <entry>
    <yt:videoId>T-tMswFb9_w</yt:videoId>
    <title>Sample Channel Video</title>
    <published>2024-06-01T10:00:00+00:00</published>
    <media:group>
      <media:description>A Mindanao story.</media:description>
      <media:community><media:statistics views="15000"/></media:community>
    </media:group>
  </entry>
</feed>
XML),
            'www.youtube.com/playlist*' => Http::response(
                '"videoId":"T-tMswFb9_w","videoId":"qsgyIeZ3788"'
            ),
            'www.youtube.com/oembed*' => Http::response(['title' => 'Second Video Title']),
            'www.youtube.com/watch*' => Http::response('"viewCount":"9200","uploadDate":"2023-01-15T10:00:00+00:00"'),
        ]);

        $this->artisan('mindanao-connect:import-videos', [
            '--channel-id' => YouTubeChannelFeed::MINDANAO_ROADTRIP_CHANNEL_ID,
        ])->assertSuccessful();

        $service = Service::query()->where('slug', 'mindanao-connect')->firstOrFail();

        $this->assertDatabaseHas('service_videos', [
            'service_id' => $service->id,
            'youtube_id' => 'T-tMswFb9_w',
            'title' => 'Sample Channel Video',
        ]);

        $this->assertDatabaseHas('service_videos', [
            'service_id' => $service->id,
            'youtube_id' => 'qsgyIeZ3788',
            'title' => 'Second Video Title',
            'view_count' => 9200,
        ]);

        $this->assertSame(2, ServiceVideo::query()->where('service_id', $service->id)->count());
    }
}
