<?php

return [

    /*
    |--------------------------------------------------------------------------
    | DigitalOcean Spaces
    |--------------------------------------------------------------------------
    |
    | S3-compatible object storage. Used as the default upload disk when
    | FILESYSTEM_DISK=spaces (recommended for production).
    |
    */

    'key' => env('DIGITALOCEAN_SPACES_KEY', env('AWS_ACCESS_KEY_ID')),

    'secret' => env('DIGITALOCEAN_SPACES_SECRET', env('AWS_SECRET_ACCESS_KEY')),

    'region' => env('DIGITALOCEAN_SPACES_REGION', env('AWS_DEFAULT_REGION', 'sgp1')),

    'bucket' => env('DIGITALOCEAN_SPACES_BUCKET', env('AWS_BUCKET')),

    'url' => rtrim((string) env('DIGITALOCEAN_SPACES_PATH', env('AWS_URL', '')), '/'),

    'endpoint' => env('DIGITALOCEAN_SPACES_ENDPOINT', env('AWS_ENDPOINT')),

    'root' => trim((string) env('DIGITALOCEAN_SPACES_ROOT_PATH', env('AWS_ROOT_PATH', 'art-website')), '/'),

    'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', false),

    /** Minutes for temporary signed URLs (if used later). */
    'temporary_url_expiration' => (int) env('DIGITALOCEAN_SPACES_EXPIRATION', 30),

];
