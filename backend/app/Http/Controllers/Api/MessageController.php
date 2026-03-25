<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class MessageController extends Controller
{
    /**
     * Get all messages in a conversation
     */
    public function index(Request $request, $conversationId)
    {
        $conversation = Conversation::findOrFail($conversationId);

        // Check if user is participant
        if (!$conversation->participants->contains($request->user()->id)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $messages = $conversation->messages()
            ->with(['sender', 'replyToMessage.sender'])
            ->get()
            ->map(function ($message) {
                $response = [
                    'id' => $message->id,
                    'conversationId' => $message->conversation_id,
                    'senderId' => $message->sender_id,
                    'content' => $message->content,
                    'type' => $message->type,
                    'timestamp' => $message->created_at,
                    'read' => $message->read,
                    'deleted' => $message->deleted,
                    'reactions' => $message->reactions,
                ];

                if ($message->replyToMessage) {
                    $response['replyToMessage'] = [
                        'senderId' => $message->replyToMessage->sender_id,
                        'senderName' => $message->replyToMessage->sender->name,
                        'content' => $message->replyToMessage->content,
                    ];
                }

                if ($message->type === 'voice' && $message->voice_duration) {
                    $response['voiceDuration'] = $message->voice_duration;
                }

                if ($message->file_path) {
                    $response['filePath'] = $message->file_path;
                    $response['fileName'] = $message->file_name;
                    $response['fileSize'] = $message->file_size;
                }

                return $response;
            });

        // Mark messages as read
        $conversation->markAsReadForUser($request->user()->id);

        return response()->json([
            'success' => true,
            'messages' => $messages,
        ]);
    }

    /**
     * Send a new message
     */
    public function store(Request $request, $conversationId)
    {
        $conversation = Conversation::findOrFail($conversationId);

        // Check if user is participant
        if (!$conversation->participants->contains($request->user()->id)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'content' => 'required|string',
            'type' => 'in:text,image,file,voice',
            'reply_to' => 'nullable|exists:messages,id',
            'voice_duration' => 'nullable|integer',
            'file' => 'nullable|file|max:10240', // 10MB max
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $filePath = null;
        $fileName = null;
        $fileSize = null;

        // Handle file upload
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $fileName = $file->getClientOriginalName();
            $fileSize = $file->getSize();
            $filePath = $file->store('chat-files', 'public');
        }

        $message = Message::create([
            'conversation_id' => $conversationId,
            'sender_id' => $request->user()->id,
            'content' => $request->content,
            'type' => $request->input('type', 'text'),
            'reply_to' => $request->reply_to,
            'voice_duration' => $request->voice_duration,
            'file_path' => $filePath,
            'file_name' => $fileName,
            'file_size' => $fileSize,
        ]);

        // Increment unread count for other participants
        $conversation->incrementUnreadForOthers($request->user()->id);

        // Format response to include file data
        $messageResponse = [
            'id' => $message->id,
            'conversation_id' => $message->conversation_id,
            'sender_id' => $message->sender_id,
            'content' => $message->content,
            'type' => $message->type,
            'created_at' => $message->created_at,
            'read' => $message->read,
            'deleted' => $message->deleted,
            'reactions' => $message->reactions,
        ];

        if ($message->voice_duration) {
            $messageResponse['voice_duration'] = $message->voice_duration;
        }

        if ($filePath) {
            $messageResponse['file_path'] = $filePath;
            $messageResponse['file_name'] = $fileName;
            $messageResponse['file_size'] = $fileSize;
        }

        return response()->json([
            'success' => true,
            'message' => $messageResponse,
        ], 201);
    }

    /**
     * Add reaction to message
     */
    public function addReaction(Request $request, $messageId)
    {
        $validator = Validator::make($request->all(), [
            'emoji' => 'required|string|max:10',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $message = Message::findOrFail($messageId);
        
        // Check if user is in conversation
        $conversation = $message->conversation;
        if (!$conversation->participants->contains($request->user()->id)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $message->addReaction($request->emoji);

        return response()->json([
            'success' => true,
            'message' => $message,
        ]);
    }

    /**
     * Delete message (soft delete)
     */
    public function destroy(Request $request, $messageId)
    {
        $message = Message::findOrFail($messageId);

        // Check if user is sender
        if ($message->sender_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized - you can only delete your own messages'
            ], 403);
        }

        $message->softDelete();

        return response()->json([
            'success' => true,
            'message' => 'Message deleted',
        ]);
    }

    /**
     * Mark messages as read
     */
    public function markAsRead(Request $request, $conversationId)
    {
        $conversation = Conversation::findOrFail($conversationId);

        // Check if user is participant
        if (!$conversation->participants->contains($request->user()->id)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $conversation->markAsReadForUser($request->user()->id);

        return response()->json([
            'success' => true,
            'message' => 'Marked as read',
        ]);
    }
}