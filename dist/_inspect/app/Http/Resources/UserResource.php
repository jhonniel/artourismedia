<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'name' => $this->name,
            'email' => $this->when($request->is('api/admin/*'), $this->email),
            'role' => $this->when($request->is('api/admin/*'), $this->role),
        ];
    }
}
