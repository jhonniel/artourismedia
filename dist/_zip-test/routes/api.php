<?php

use App\Http\Controllers\Api\Admin\ActivityLogController;
use App\Http\Controllers\Api\Admin\AuthController;
use App\Http\Controllers\Api\Admin\CacheController;
use App\Http\Controllers\Api\Admin\ContactSubmissionController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\HomepageSectionController;
use App\Http\Controllers\Api\Admin\MediaController;
use App\Http\Controllers\Api\Admin\NavigationController;
use App\Http\Controllers\Api\Admin\NewsletterSubscriberController;
use App\Http\Controllers\Api\Admin\PageController;
use App\Http\Controllers\Api\Admin\PostCategoryController;
use App\Http\Controllers\Api\Admin\PostController;
use App\Http\Controllers\Api\Admin\ProjectCategoryController;
use App\Http\Controllers\Api\Admin\ProjectController;
use App\Http\Controllers\Api\Admin\SeoSettingController;
use App\Http\Controllers\Api\Admin\ServiceController;
use App\Http\Controllers\Api\Admin\ServiceVideoController;
use App\Http\Controllers\Api\Admin\SiteSettingController;
use App\Http\Controllers\Api\Admin\SocialLinkController;
use App\Http\Controllers\Api\Admin\StatisticController;
use App\Http\Controllers\Api\Admin\TagController;
use App\Http\Controllers\Api\Admin\TrustStripItemController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Public\CategoryController;
use App\Http\Controllers\Api\Public\ContactController;
use App\Http\Controllers\Api\Public\HealthController;
use App\Http\Controllers\Api\Public\HomepageController;
use App\Http\Controllers\Api\Public\NavigationController as PublicNavigationController;
use App\Http\Controllers\Api\Public\NewsletterController;
use App\Http\Controllers\Api\Public\PageController as PublicPageController;
use App\Http\Controllers\Api\Public\PostController as PublicPostController;
use App\Http\Controllers\Api\Public\ProjectController as PublicProjectController;
use App\Http\Controllers\Api\Public\ServiceController as PublicServiceController;
use App\Http\Controllers\Api\Public\SiteController;
use App\Http\Controllers\Api\Public\SitemapController;
use App\Http\Controllers\Api\Public\SocialLinkController as PublicSocialLinkController;
use Illuminate\Support\Facades\Route;

Route::get('/health', [HealthController::class, 'show']);
Route::get('/site', [SiteController::class, 'show']);
Route::get('/navigation', [PublicNavigationController::class, 'index']);
Route::get('/homepage', [HomepageController::class, 'index']);
Route::get('/services', [PublicServiceController::class, 'index']);
Route::get('/services/{slug}', [PublicServiceController::class, 'show']);
Route::get('/projects', [PublicProjectController::class, 'index']);
Route::get('/projects/{slug}', [PublicProjectController::class, 'show']);
Route::get('/sitemap', [SitemapController::class, 'index']);
Route::get('/sitemap.xml', [SitemapController::class, 'xml']);
Route::get('/posts/preview/{uuid}', [PublicPostController::class, 'preview']);
Route::get('/projects/preview/{uuid}', [PublicProjectController::class, 'preview']);
Route::get('/services/preview/{uuid}', [PublicServiceController::class, 'preview']);
Route::get('/posts', [PublicPostController::class, 'index']);
Route::get('/posts/{slug}', [PublicPostController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/social-links', [PublicSocialLinkController::class, 'index']);
Route::get('/pages/{slug}', [PublicPageController::class, 'show']);
Route::post('/contact', [ContactController::class, 'store'])->middleware('throttle:contact');
Route::post('/newsletter', [NewsletterController::class, 'subscribe'])->middleware('throttle:newsletter');
Route::post('/newsletter/unsubscribe', [NewsletterController::class, 'unsubscribe'])->middleware('throttle:newsletter');

Route::prefix('admin')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:login');
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->middleware('throttle:forgot-password');
    Route::post('/reset-password', [AuthController::class, 'resetPassword'])->middleware('throttle:forgot-password');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);

        Route::middleware('role:admin,editor,author')->group(function () {
            Route::get('/dashboard', [DashboardController::class, 'index']);

            Route::apiResource('posts', PostController::class)->parameters(['posts' => 'uuid']);
            Route::post('posts/bulk', [PostController::class, 'bulk']);
            Route::post('posts/{uuid}/preview-token', [PostController::class, 'previewToken']);

            Route::get('categories', [PostCategoryController::class, 'index']);
            Route::get('tags', [TagController::class, 'index']);
            Route::get('users', [UserController::class, 'index']);

            Route::apiResource('media', MediaController::class)->except(['store'])->parameters(['media' => 'uuid']);
            Route::post('media/upload', [MediaController::class, 'upload']);
        });

        Route::middleware('role:admin,editor')->group(function () {
            Route::apiResource('categories', PostCategoryController::class)->parameters(['categories' => 'uuid'])->except(['index']);
            Route::post('categories/reorder', [PostCategoryController::class, 'reorder']);

            Route::apiResource('tags', TagController::class)->parameters(['tags' => 'uuid'])->except(['index']);
            Route::apiResource('services', ServiceController::class)->parameters(['services' => 'uuid']);
            Route::post('services/reorder', [ServiceController::class, 'reorder']);
            Route::post('services/{uuid}/preview-token', [ServiceController::class, 'previewToken']);

            Route::apiResource('project-categories', ProjectCategoryController::class)->parameters(['project-categories' => 'uuid']);
            Route::post('project-categories/reorder', [ProjectCategoryController::class, 'reorder']);

            Route::apiResource('projects', ProjectController::class)->parameters(['projects' => 'uuid']);
            Route::post('projects/reorder', [ProjectController::class, 'reorder']);
            Route::post('projects/{uuid}/preview-token', [ProjectController::class, 'previewToken']);

            Route::apiResource('statistics', StatisticController::class)->parameters(['statistics' => 'uuid']);
            Route::post('statistics/reorder', [StatisticController::class, 'reorder']);

            Route::apiResource('navigation', NavigationController::class)->parameters(['navigation' => 'uuid']);
            Route::post('navigation/reorder', [NavigationController::class, 'reorder']);

            Route::apiResource('social-links', SocialLinkController::class)->parameters(['social-links' => 'uuid']);
            Route::post('social-links/reorder', [SocialLinkController::class, 'reorder']);

            Route::apiResource('contact-submissions', ContactSubmissionController::class)->only(['index', 'show', 'update', 'destroy'])->parameters(['contact-submissions' => 'uuid']);
            Route::patch('contact-submissions/{uuid}/read', [ContactSubmissionController::class, 'markAsRead']);
            Route::post('contact-submissions/bulk', [ContactSubmissionController::class, 'bulk']);

            Route::apiResource('newsletter-subscribers', NewsletterSubscriberController::class)->only(['index', 'show', 'destroy'])->parameters(['newsletter-subscribers' => 'uuid']);
            Route::patch('newsletter-subscribers/{uuid}/unsubscribe', [NewsletterSubscriberController::class, 'unsubscribe']);

            Route::apiResource('homepage-sections', HomepageSectionController::class)->parameters(['homepage-sections' => 'uuid']);
            Route::post('homepage-sections/reorder', [HomepageSectionController::class, 'reorder']);

            Route::apiResource('trust-strip-items', TrustStripItemController::class)->parameters(['trust-strip-items' => 'uuid']);
            Route::post('trust-strip-items/reorder', [TrustStripItemController::class, 'reorder']);

            Route::apiResource('mindanao-connect/videos', ServiceVideoController::class)
                ->parameters(['videos' => 'uuid']);
            Route::post('mindanao-connect/videos/reorder', [ServiceVideoController::class, 'reorder']);
            Route::post('mindanao-connect/videos/import', [ServiceVideoController::class, 'importFromChannel']);

            Route::apiResource('pages', PageController::class)->parameters(['pages' => 'uuid']);
        });

        Route::middleware('role:admin')->group(function () {
            Route::post('/cache/flush', [CacheController::class, 'flush']);
            Route::get('/activity-logs', [ActivityLogController::class, 'index']);

            Route::apiResource('users', UserController::class)->parameters(['users' => 'uuid'])->except(['index']);

            Route::apiResource('settings', SiteSettingController::class)->parameters(['settings' => 'uuid']);
            Route::put('settings/bulk', [SiteSettingController::class, 'bulkUpdate']);

            Route::apiResource('seo-settings', SeoSettingController::class)->parameters(['seo-settings' => 'uuid']);
        });
    });
});
