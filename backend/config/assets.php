<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Static assets (DigitalOcean Spaces CDN)
    |--------------------------------------------------------------------------
    |
    | Public site images are served from Spaces, not bundled in public/images.
    | Set ASSETS_BASE_URL in .env (no trailing slash).
    |
    | Example:
    | https://infosoft.sgp1.digitaloceanspaces.com/tingog/reports/static
    |
    */

    'base_url' => rtrim((string) env('ASSETS_BASE_URL', ''), '/'),

    /** Prefix on the Spaces disk for static site files (under spaces.root). */
    'spaces_prefix' => trim((string) env('ASSETS_SPACES_PREFIX', 'static'), '/'),

];
