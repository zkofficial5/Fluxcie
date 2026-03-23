<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FriendRequest;
use App\Models\Friendship;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class FriendController extends Controller
{
    /**
     * Get all friends of authenticated user
     */
   public function index(Request $request)
{
    $user = $request->user();
    
    // Get friend IDs from friendships table
    $friendIds = \App\Models\Friendship::where('user_id', $user->id)
        ->pluck('friend_id')
        ->toArray();
    
    // Get actual user data for those friends
    $friends = \App\Models\User::whereIn('id', $friendIds)
        ->get()
        ->map(function ($friend) {
            return [
                'id' => $friend->id,
                'name' => $friend->name,
                'username' => $friend->username,
                'avatar' => $friend->avatar,
                'status' => $friend->status,
                'lastSeen' => $friend->last_seen,
                'bio' => $friend->bio,
            ];
        });

    return response()->json([
        'success' => true,
        'friends' => $friends,
    ]);
}

    /**
     * Send friend request
     */
    public function sendRequest(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|exists:users,username',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $toUser = User::where('username', $request->username)->firstOrFail();

        // Can't send request to yourself
        if ($toUser->id === $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot send friend request to yourself'
            ], 400);
        }

        // Check if already friends
        if (Friendship::areFriends($request->user()->id, $toUser->id)) {
            return response()->json([
                'success' => false,
                'message' => 'Already friends'
            ], 400);
        }

        // Check if request already exists
        $existingRequest = FriendRequest::where(function ($query) use ($request, $toUser) {
            $query->where('from_user_id', $request->user()->id)
                ->where('to_user_id', $toUser->id);
        })->orWhere(function ($query) use ($request, $toUser) {
            $query->where('from_user_id', $toUser->id)
                ->where('to_user_id', $request->user()->id);
        })->first();

        if ($existingRequest) {
            if ($existingRequest->status === 'pending') {
                return response()->json([
                    'success' => false,
                    'message' => 'Friend request already sent'
                ], 400);
            }
        }

        $friendRequest = $request->user()->sendFriendRequestTo($toUser->id);

        return response()->json([
            'success' => true,
            'friendRequest' => $friendRequest->load(['fromUser', 'toUser']),
        ], 201);
    }

    /**
     * Get sent friend requests
     */
    public function sentRequests(Request $request)
    {
        $sentRequests = $request->user()
            ->sentFriendRequests()
            ->where('status', 'pending')
            ->with('toUser')
            ->get()
            ->map(function ($req) {
                return [
                    'id' => $req->id,
                    'user' => [
                        'id' => $req->toUser->id,
                        'name' => $req->toUser->name,
                        'username' => $req->toUser->username,
                        'avatar' => $req->toUser->avatar,
                        'bio' => $req->toUser->bio,
                    ],
                    'status' => $req->status,
                    'timestamp' => $req->created_at,
                ];
            });

        return response()->json([
            'success' => true,
            'requests' => $sentRequests,
        ]);
    }

    /**
     * Get received friend requests
     */
    public function receivedRequests(Request $request)
    {
        $receivedRequests = $request->user()
            ->receivedFriendRequests()
            ->where('status', 'pending')
            ->with('fromUser')
            ->get()
            ->map(function ($req) {
                return [
                    'id' => $req->id,
                    'user' => [
                        'id' => $req->fromUser->id,
                        'name' => $req->fromUser->name,
                        'username' => $req->fromUser->username,
                        'avatar' => $req->fromUser->avatar,
                        'bio' => $req->fromUser->bio,
                    ],
                    'status' => $req->status,
                    'timestamp' => $req->created_at,
                ];
            });

        return response()->json([
            'success' => true,
            'requests' => $receivedRequests,
        ]);
    }

    /**
     * Accept friend request
     */
    public function acceptRequest(Request $request, $requestId)
    {
        $friendRequest = FriendRequest::findOrFail($requestId);

        // Check if request is for current user
        if ($friendRequest->to_user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        if (!$friendRequest->isPending()) {
            return response()->json([
                'success' => false,
                'message' => 'Request already processed'
            ], 400);
        }

        $friendRequest->accept();

        return response()->json([
            'success' => true,
            'message' => 'Friend request accepted',
        ]);
    }

    /**
     * Decline friend request
     */
    public function declineRequest(Request $request, $requestId)
    {
        $friendRequest = FriendRequest::findOrFail($requestId);

        // Check if request is for current user
        if ($friendRequest->to_user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        if (!$friendRequest->isPending()) {
            return response()->json([
                'success' => false,
                'message' => 'Request already processed'
            ], 400);
        }

        $friendRequest->decline();

        return response()->json([
            'success' => true,
            'message' => 'Friend request declined',
        ]);
    }

    /**
     * Cancel sent friend request
     */
    public function cancelRequest(Request $request, $requestId)
    {
        $friendRequest = FriendRequest::findOrFail($requestId);

        // Check if request is from current user
        if ($friendRequest->from_user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $friendRequest->delete();

        return response()->json([
            'success' => true,
            'message' => 'Friend request cancelled',
        ]);
    }

    /**
     * Unfriend a user
     */
    public function unfriend(Request $request, $friendId)
    {
        $friend = User::findOrFail($friendId);

        if (!Friendship::areFriends($request->user()->id, $friendId)) {
            return response()->json([
                'success' => false,
                'message' => 'Not friends'
            ], 400);
        }

        Friendship::unfriend($request->user()->id, $friendId);

        return response()->json([
            'success' => true,
            'message' => 'Unfriended successfully',
        ]);
    }

    /**
     * Search users by username
     */
    public function searchUsers(Request $request)
    {
        // Get query from URL parameters (GET request)
        $searchQuery = $request->query('query');
        
        Log::info('Search request received', ['query' => $searchQuery]);

        // Validate
        if (empty($searchQuery) || strlen($searchQuery) < 1) {
            return response()->json([
                'success' => false,
                'message' => 'Query parameter is required',
                'users' => []
            ], 422);
        }

        // Search users
        $users = User::where('username', 'LIKE', '%' . $searchQuery . '%')
            ->where('id', '!=', $request->user()->id)
            ->limit(20)
            ->get()
            ->map(function ($user) use ($request) {
                $isFriend = Friendship::areFriends($request->user()->id, $user->id);
                
                $hasPendingRequest = FriendRequest::where(function ($query) use ($request, $user) {
                    $query->where('from_user_id', $request->user()->id)
                        ->where('to_user_id', $user->id);
                })->where('status', 'pending')->exists();

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'avatar' => $user->avatar,
                    'bio' => $user->bio,
                    'isFriend' => $isFriend,
                    'hasPendingRequest' => $hasPendingRequest,
                ];
            });

        Log::info('Search results', ['count' => $users->count()]);

        return response()->json([
            'success' => true,
            'users' => $users,
        ]);
    }
}