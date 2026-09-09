<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class HealthController extends Controller
{
    public function show(): JsonResponse
    {
        $checks = [
            'database' => $this->checkDatabase(),
            'cache' => $this->checkCache(),
            'storage' => $this->checkStorage(),
        ];

        $healthy = collect($checks)->every(fn (array $check) => $check['status'] === 'ok');

        return ApiResponse::success([
            'status' => $healthy ? 'ok' : 'degraded',
            'app' => config('app.name'),
            'environment' => config('app.env'),
            'checks' => $checks,
        ], $healthy ? 'Healthy' : 'Degraded', $healthy ? 200 : 503);
    }

    protected function checkDatabase(): array
    {
        try {
            DB::connection()->getPdo();

            return ['status' => 'ok'];
        } catch (\Throwable $e) {
            return ['status' => 'error', 'message' => 'Database connection failed'];
        }
    }

    protected function checkCache(): array
    {
        try {
            $key = 'health_check_'.uniqid();
            Cache::put($key, true, 10);
            $value = Cache::get($key);
            Cache::forget($key);

            return $value ? ['status' => 'ok', 'driver' => config('cache.default')] : ['status' => 'error', 'message' => 'Cache read/write failed'];
        } catch (\Throwable $e) {
            return ['status' => 'error', 'message' => 'Cache unavailable'];
        }
    }

    protected function checkStorage(): array
    {
        try {
            $disk = Storage::disk(config('filesystems.default'));
            $path = 'health-check-'.uniqid().'.txt';
            $disk->put($path, 'ok');
            $exists = $disk->exists($path);
            $disk->delete($path);

            return $exists
                ? ['status' => 'ok', 'disk' => config('filesystems.default')]
                : ['status' => 'error', 'message' => 'Storage write failed'];
        } catch (\Throwable $e) {
            return ['status' => 'error', 'message' => 'Storage unavailable'];
        }
    }
}
