<?php

namespace App\Services;

use App\Models\Media;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaService extends CrudService
{
    public function __construct(ActivityLogService $activityLog)
    {
        parent::__construct(new Media, $activityLog, 'media');
    }

    protected function mediaDisk(): \Illuminate\Contracts\Filesystem\Filesystem
    {
        return Storage::disk(config('filesystems.default'));
    }

    public function upload(UploadedFile $file, ?int $userId = null, ?string $altText = null): Media
    {
        $disk = $this->mediaDisk();
        $filename = Str::uuid().'.'.$file->getClientOriginalExtension();
        $path = $file->storeAs('media', $filename, config('filesystems.default'));
        $url = $disk->url($path);

        $imageSize = @getimagesize($file->getRealPath());
        $thumbnailUrl = $this->generateThumbnail($file, $filename);

        $media = $this->create([
            'filename' => $filename,
            'original_filename' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'width' => $imageSize[0] ?? null,
            'height' => $imageSize[1] ?? null,
            'url' => $url,
            'thumbnail_url' => $thumbnailUrl,
            'alt_text' => $altText,
            'uploaded_by' => $userId,
        ]);

        return $media;
    }

    protected function generateThumbnail(UploadedFile $file, string $filename): ?string
    {
        if (! str_starts_with($file->getMimeType(), 'image/') || ! function_exists('imagecreatefromstring')) {
            return null;
        }

        $contents = file_get_contents($file->getRealPath());
        if ($contents === false) {
            return null;
        }

        $source = @imagecreatefromstring($contents);
        if ($source === false) {
            return null;
        }

        $srcW = imagesx($source);
        $srcH = imagesy($source);
        $maxW = 400;
        $scale = min(1, $maxW / max($srcW, 1));
        $dstW = (int) max(1, $srcW * $scale);
        $dstH = (int) max(1, $srcH * $scale);

        $thumb = imagecreatetruecolor($dstW, $dstH);
        imagecopyresampled($thumb, $source, 0, 0, 0, 0, $dstW, $dstH, $srcW, $srcH);

        ob_start();
        $saved = imagejpeg($thumb, null, 82);
        $jpegData = ob_get_clean();

        imagedestroy($source);
        imagedestroy($thumb);

        if (! $saved || $jpegData === false) {
            return null;
        }

        $disk = $this->mediaDisk();
        $thumbPath = 'media/thumb_'.$filename;
        $disk->put($thumbPath, $jpegData, ['visibility' => 'public']);

        return $disk->url($thumbPath);
    }

    protected function searchableColumns(): array
    {
        return ['filename', 'original_filename', 'alt_text'];
    }
}
