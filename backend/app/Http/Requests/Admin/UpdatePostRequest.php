<?php

namespace App\Http\Requests\Admin;

use App\Models\PostCategory;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'post_category_uuid' => ['nullable', 'uuid', Rule::exists('post_categories', 'uuid')],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('posts', 'slug')->ignore($this->route('uuid'), 'uuid')],
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string'],
            'content' => ['nullable', 'string'],
            'featured_image_url' => ['nullable', 'string', 'max:500'],
            'thumbnail_url' => ['nullable', 'string', 'max:500'],
            'status' => ['nullable', 'string', 'in:draft,published,archived'],
            'is_featured' => ['nullable', 'boolean'],
            'reading_time' => ['nullable', 'integer', 'min:1'],
            'published_at' => ['nullable', 'date'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string'],
            'seo_keywords' => ['nullable', 'string'],
            'allow_social_sharing' => ['nullable', 'boolean'],
            'author_uuid' => ['nullable', 'uuid', Rule::exists('users', 'uuid')],
            'tag_uuids' => ['nullable', 'array'],
            'tag_uuids.*' => ['uuid', Rule::exists('tags', 'uuid')],
        ];
    }

    public function validated($key = null, $default = null): array
    {
        $data = parent::validated($key, $default);

        if (array_key_exists('post_category_uuid', $data)) {
            $data['post_category_id'] = $data['post_category_uuid']
                ? PostCategory::query()->where('uuid', $data['post_category_uuid'])->value('id')
                : null;
            unset($data['post_category_uuid']);
        }

        if (array_key_exists('author_uuid', $data)) {
            $data['author_id'] = $this->user()->isAuthor()
                ? $this->user()->id
                : ($data['author_uuid']
                    ? User::query()->where('uuid', $data['author_uuid'])->value('id')
                    : null);
            unset($data['author_uuid']);
        }

        return $data;
    }
}
