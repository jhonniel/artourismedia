<?php

namespace App\Services;

class HtmlSanitizer
{
    protected array $allowedTags = [
        'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'blockquote',
        'ul', 'ol', 'li', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'img', 'figure', 'figcaption', 'hr', 'code', 'pre', 'span', 'div',
    ];

    public function sanitize(?string $html): ?string
    {
        if ($html === null || $html === '') {
            return $html;
        }

        $allowed = '<'.implode('><', $this->allowedTags).'>';
        $clean = strip_tags($html, $allowed);

        return preg_replace('/\s(on\w+|javascript:|data:text\/html)[^>]*/i', '', $clean) ?? $clean;
    }
}
