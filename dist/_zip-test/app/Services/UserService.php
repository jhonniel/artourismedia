<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UserService
{
    public function list(): mixed
    {
        return User::query()->orderBy('name')->get();
    }

    public function findByUuid(string $uuid): User
    {
        return User::query()->where('uuid', $uuid)->firstOrFail();
    }

    public function create(array $data): User
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'role' => $data['role'] ?? 'editor',
        ]);
    }

    public function update(User $user, array $data): User
    {
        if (! empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        return $user->fresh();
    }

    public function delete(User $user): void
    {
        if (User::query()->where('role', 'admin')->count() <= 1 && $user->role === 'admin') {
            throw ValidationException::withMessages([
                'user' => ['Cannot delete the last admin account.'],
            ]);
        }

        $user->tokens()->delete();
        $user->delete();
    }
}
