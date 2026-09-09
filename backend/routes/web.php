<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Response;

if (file_exists(public_path('admin/index.html'))) {
    Route::get('/admin/{path?}', function () {
        return Response::file(public_path('admin/index.html'), [
            'Content-Type' => 'text/html; charset=UTF-8',
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
        ]);
    })->where('path', '.*')->name('admin.spa');
}

if (file_exists(public_path('index.html'))) {
    Route::get('/{path?}', function () {
        return Response::file(public_path('index.html'), [
            'Content-Type' => 'text/html; charset=UTF-8',
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
        ]);
    })->where('path', '^(?!api(?:/|$)|sanctum(?:/|$)|storage(?:/|$)|assets(?:/|$)|build(?:/|$)|up$).*')->name('spa');
}
