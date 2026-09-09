<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('mindanao-connect:import-videos')
    ->twiceDaily(6, 18)
    ->withoutOverlapping()
    ->runInBackground()
    ->appendOutputTo(storage_path('logs/mindanao-connect-videos.log'));
