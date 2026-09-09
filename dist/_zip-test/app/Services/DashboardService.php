<?php

namespace App\Services;

use App\Models\ContactSubmission;
use App\Models\NewsletterSubscriber;
use App\Models\Post;
use App\Models\Project;
use App\Models\Service;
use App\Models\User;

class DashboardService
{
    public function getDashboardData(): array
    {
        $user = auth()->user();
        $postsQuery = Post::query();

        if ($user instanceof User && $user->isAuthor()) {
            $postsQuery->where('author_id', $user->id);
        }

        return [
            'stats' => [
                'posts' => (clone $postsQuery)->count(),
                'projects' => $user instanceof User && $user->isAuthor()
                    ? 0
                    : Project::count(),
                'services' => $user instanceof User && $user->isAuthor()
                    ? 0
                    : Service::query()->where('is_active', true)->count(),
                'messages' => $user instanceof User && $user->isAuthor()
                    ? 0
                    : ContactSubmission::query()->where('status', 'new')->count(),
                'subscribers' => $user instanceof User && $user->isAuthor()
                    ? 0
                    : NewsletterSubscriber::query()->where('status', 'subscribed')->count(),
            ],
            'recent_posts' => (clone $postsQuery)
                ->with(['category'])
                ->latest('updated_at')
                ->limit(5)
                ->get(),
            'recent_projects' => $user instanceof User && $user->isAuthor()
                ? collect()
                : Project::query()->latest('updated_at')->limit(5)->get(),
            'recent_messages' => $user instanceof User && $user->isAuthor()
                ? collect()
                : ContactSubmission::query()->latest()->limit(5)->get(),
        ];
    }
}
