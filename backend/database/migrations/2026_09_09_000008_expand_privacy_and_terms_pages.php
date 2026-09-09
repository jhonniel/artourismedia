<?php

use App\Support\LegalPageContent;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('pages')
            ->where('slug', 'privacy-policy')
            ->update([
                'title' => 'Privacy Policy',
                'content' => LegalPageContent::privacyPolicy(),
                'seo_title' => 'Privacy Policy | ArTourisMedia',
                'seo_description' => 'Learn how ArTourisMedia collects, uses, and protects personal information submitted through our website, contact forms, and newsletter.',
                'updated_at' => now(),
            ]);

        DB::table('pages')
            ->where('slug', 'terms-of-use')
            ->update([
                'title' => 'Terms of Use',
                'content' => LegalPageContent::termsOfUse(),
                'seo_title' => 'Terms of Use | ArTourisMedia',
                'seo_description' => 'Terms governing use of the ArTourisMedia website, content, and online communications.',
                'updated_at' => now(),
            ]);
    }

    public function down(): void
    {
        DB::table('pages')
            ->where('slug', 'privacy-policy')
            ->update([
                'content' => '<p>Destination Studio respects your privacy. This policy explains how we collect, use, and protect personal information submitted through our website and consultation forms.</p>',
                'seo_title' => null,
                'seo_description' => null,
                'updated_at' => now(),
            ]);

        DB::table('pages')
            ->where('slug', 'terms-of-use')
            ->update([
                'content' => '<p>By using the Destination Studio website, you agree to these terms. Content is provided for informational purposes and does not constitute professional advice without a signed engagement.</p>',
                'seo_title' => 'Terms of Use | Destination Studio',
                'seo_description' => null,
                'updated_at' => now(),
            ]);
    }
};
