<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Get all users (for admin or testing purposes)
     */
    public function index(Request $request)
    {
        $users = User::where('id', '!=', $request->user()->id)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'avatar' => $user->avatar,
                    'status' => $user->status,
                    'lastSeen' => $user->last_seen,
                    'bio' => $user->bio,
                ];
            });

        return response()->json([
            'success' => true,
            'users' => $users,
        ]);
    }

    /**
     * Get a specific user by ID
     */
    public function show($id)
    {
        $user = User::findOrFail($id);

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'avatar' => $user->avatar,
                'status' => $user->status,
                'lastSeen' => $user->last_seen,
                'bio' => $user->bio,
            ],
        ]);
    }

    /**
     * Get user by username
     */
    public function getByUsername($username)
    {
        $user = User::where('username', $username)->firstOrFail();

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'avatar' => $user->avatar,
                'status' => $user->status,
                'lastSeen' => $user->last_seen,
                'bio' => $user->bio,
            ],
        ]);
    }
}