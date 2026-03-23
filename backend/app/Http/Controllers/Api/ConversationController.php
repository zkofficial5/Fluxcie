<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ConversationController extends Controller
{
    /**
     * Get all conversations for authenticated user
     */
    public function index(Request $request)
    {
        $conversations = $request->user()
            ->conversations()
            ->with(['participants', 'lastMessage.sender'])
            ->get()
            ->map(function ($conversation) use ($request) {
                return [
                    'id' => $conversation->id,
                    'isGroup' => $conversation->is_group,
                    'groupName' => $conversation->group_name,
                    'groupAvatar' => $conversation->group_avatar,
                    'participants' => $conversation->participants->map(function ($user) {
                        return [
                            'id' => $user->id,
                            'name' => $user->name,
                            'username' => $user->username,
                            'avatar' => $user->avatar,
                            'status' => $user->status,
                            'lastSeen' => $user->last_seen,
                            'bio' => $user->bio,
                        ];
                    }),
                    'lastMessage' => $conversation->lastMessage ? [
                        'id' => $conversation->lastMessage->id,
                        'content' => $conversation->lastMessage->content,
                        'senderId' => $conversation->lastMessage->sender_id,
                        'timestamp' => $conversation->lastMessage->created_at,
                        'read' => $conversation->lastMessage->read,
                    ] : null,
                    'unreadCount' => $conversation->getUnreadCountForUser($request->user()->id),
                    'mutedUntil' => $conversation->muted_until,
                    'muteType' => $conversation->mute_type,
                ];
            });

        return response()->json([
            'success' => true,
            'conversations' => $conversations,
        ]);
    }

    /**
     * Create a new conversation (DM or Group)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'participant_ids' => 'required|array|min:1',
            'participant_ids.*' => 'exists:users,id',
            'is_group' => 'boolean',
            'group_name' => 'required_if:is_group,true|string|max:255',
            'group_avatar' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $isGroup = $request->input('is_group', false);
        
        // For DM, check if conversation already exists
        if (!$isGroup && count($request->participant_ids) === 1) {
            $existingConversation = $request->user()
                ->conversations()
                ->where('is_group', false)
                ->whereHas('participants', function ($query) use ($request) {
                    $query->where('user_id', $request->participant_ids[0]);
                })
                ->first();

            if ($existingConversation) {
                return response()->json([
                    'success' => true,
                    'conversation' => $existingConversation->load(['participants', 'messages']),
                    'message' => 'Conversation already exists',
                ]);
            }
        }

        $conversation = Conversation::create([
            'is_group' => $isGroup,
            'group_name' => $request->group_name,
            'group_avatar' => $request->group_avatar ?? ($isGroup ? 'https://api.dicebear.com/7.x/shapes/svg?seed=' . $request->group_name : null),
        ]);

        // Add current user
        $conversation->participants()->attach($request->user()->id);
        
        // Add other participants
        foreach ($request->participant_ids as $userId) {
            if ($userId != $request->user()->id) {
                $conversation->participants()->attach($userId);
            }
        }

        return response()->json([
            'success' => true,
            'conversation' => $conversation->load(['participants', 'messages']),
        ], 201);
    }

    /**
     * Get a specific conversation
     */
    public function show(Request $request, $id)
    {
        $conversation = Conversation::with(['participants', 'messages.sender'])
            ->findOrFail($id);

        // Check if user is participant
        if (!$conversation->participants->contains($request->user()->id)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        // Mark as read
        $conversation->markAsReadForUser($request->user()->id);

        return response()->json([
            'success' => true,
            'conversation' => $conversation,
        ]);
    }

    /**
     * Add participants to group conversation
     */
    public function addParticipants(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'user_ids' => 'required|array|min:1',
            'user_ids.*' => 'exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $conversation = Conversation::findOrFail($id);

        if (!$conversation->is_group) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot add participants to DM'
            ], 400);
        }

        // Check if user is participant
        if (!$conversation->participants->contains($request->user()->id)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        foreach ($request->user_ids as $userId) {
            if (!$conversation->participants->contains($userId)) {
                $conversation->participants()->attach($userId);
            }
        }

        return response()->json([
            'success' => true,
            'conversation' => $conversation->load('participants'),
        ]);
    }

    /**
     * Mute/unmute conversation
     */
    public function mute(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'mute_type' => 'required|in:hours,week,forever,unmute',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $conversation = Conversation::findOrFail($id);

        if ($request->mute_type === 'unmute') {
            $conversation->muted_until = null;
            $conversation->mute_type = null;
        } else {
            $conversation->mute_type = $request->mute_type;
            
            switch ($request->mute_type) {
                case 'hours':
                    $conversation->muted_until = now()->addHours(8);
                    break;
                case 'week':
                    $conversation->muted_until = now()->addWeek();
                    break;
                case 'forever':
                    $conversation->muted_until = now()->addYears(100);
                    break;
            }
        }

        $conversation->save();

        return response()->json([
            'success' => true,
            'conversation' => $conversation,
        ]);
    }

    /**
     * Delete conversation (leave for user)
     */
    public function destroy(Request $request, $id)
    {
        $conversation = Conversation::findOrFail($id);

        // Check if user is participant
        if (!$conversation->participants->contains($request->user()->id)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        // Remove user from conversation
        $conversation->participants()->detach($request->user()->id);

        // If no participants left, delete conversation
        if ($conversation->participants()->count() === 0) {
            $conversation->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Left conversation successfully',
        ]);
    }
}