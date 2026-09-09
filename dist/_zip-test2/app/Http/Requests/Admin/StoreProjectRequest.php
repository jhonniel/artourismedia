<?php

namespace App\Http\Requests\Admin;

use App\Models\ProjectCategory;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'project_category_uuid' => ['nullable', 'uuid', Rule::exists('project_categories', 'uuid')],
            'slug' => ['nullable', 'string', 'max:255', 'unique:projects,slug'],
            'title' => ['required', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string'],
            'content' => ['nullable', 'string'],
            'cover_image_url' => ['nullable', 'string', 'max:500'],
            'category_label' => ['nullable', 'string', 'max:255'],
            'cta_text' => ['nullable', 'string', 'max:255'],
            'cta_url' => ['nullable', 'string', 'max:500'],
            'color' => ['nullable', 'string', 'max:50'],
            'is_featured' => ['nullable', 'boolean'],
            'is_published' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string'],
        ];
    }

    public function validated($key = null, $default = null): array
    {
        $data = parent::validated($key, $default);

        if (! empty($data['project_category_uuid'])) {
            $data['project_category_id'] = ProjectCategory::query()
                ->where('uuid', $data['project_category_uuid'])
                ->value('id');
            unset($data['project_category_uuid']);
        }

        return $data;
    }
}
