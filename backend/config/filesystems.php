<?php

$spaces = require __DIR__.'/spaces.php';

$spacesDisk = [
    'driver' => 's3',
    'key' => $spaces['key'],
    'secret' => $spaces['secret'],
    'region' => $spaces['region'],
    'bucket' => $spaces['bucket'],
    'url' => $spaces['url'] ?: null,
    'endpoint' => $spaces['endpoint'],
    'use_path_style_endpoint' => $spaces['use_path_style_endpoint'],
    'root' => $spaces['root'] !== '' ? $spaces['root'] : null,
    'visibility' => 'public',
    'throw' => false,
    'report' => false,
];

return [

    /*
    |--------------------------------------------------------------------------
    | Default Filesystem Disk
    |--------------------------------------------------------------------------
    |
    | Use "spaces" for DigitalOcean Spaces (all CMS media uploads).
    |
    */

    'default' => env('FILESYSTEM_DISK', 'spaces'),

    /*
    |--------------------------------------------------------------------------
    | Filesystem Disks
    |--------------------------------------------------------------------------
    */

    'disks' => [

        'local' => [
            'driver' => 'local',
            'root' => storage_path('app/private'),
            'serve' => true,
            'throw' => false,
            'report' => false,
        ],

        'public' => [
            'driver' => 'local',
            'root' => storage_path('app/public'),
            'url' => rtrim(env('APP_URL', 'http://localhost'), '/').'/storage',
            'visibility' => 'public',
            'throw' => false,
            'report' => false,
        ],

        'spaces' => $spacesDisk,

        /** @deprecated Use "spaces" — kept for legacy AWS_* env vars */
        's3' => $spacesDisk,

    ],

    /*
    |--------------------------------------------------------------------------
    | Symbolic Links
    |--------------------------------------------------------------------------
    */

    'links' => [
        public_path('storage') => storage_path('app/public'),
    ],

];
