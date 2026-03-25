<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ConversationController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\FriendController;
use App\Http\Controllers\Api\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes (no authentication required)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/profile/avatar', [AuthController::class, 'uploadAvatar']); // NEW
    Route::put('/status', [AuthController::class, 'updateStatus']);
    
    // User routes - SEARCH MUST COME BEFORE {id}
    Route::get('/users/search', [FriendController::class, 'searchUsers']);
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::get('/users/username/{username}', [UserController::class, 'getByUsername']);
    
    // Conversation routes
    Route::get('/conversations', [ConversationController::class, 'index']);
    Route::post('/conversations', [ConversationController::class, 'store']);
    Route::get('/conversations/{id}', [ConversationController::class, 'show']);
    Route::post('/conversations/{id}/participants', [ConversationController::class, 'addParticipants']);
    Route::put('/conversations/{id}/mute', [ConversationController::class, 'mute']);
    Route::delete('/conversations/{id}', [ConversationController::class, 'destroy']);
    
    // Message routes
    Route::get('/conversations/{conversationId}/messages', [MessageController::class, 'index']);
    Route::post('/conversations/{conversationId}/messages', [MessageController::class, 'store']);
    Route::post('/messages/{messageId}/react', [MessageController::class, 'addReaction']);
    Route::delete('/messages/{messageId}', [MessageController::class, 'destroy']);
    Route::post('/conversations/{conversationId}/mark-read', [MessageController::class, 'markAsRead']);
    
    // Friend routes
    Route::get('/friends', [FriendController::class, 'index']);
    Route::post('/friends/request', [FriendController::class, 'sendRequest']);
    Route::get('/friends/requests/sent', [FriendController::class, 'sentRequests']);
    Route::get('/friends/requests/received', [FriendController::class, 'receivedRequests']);
    Route::post('/friends/requests/{requestId}/accept', [FriendController::class, 'acceptRequest']);
    Route::post('/friends/requests/{requestId}/decline', [FriendController::class, 'declineRequest']);
    Route::delete('/friends/requests/{requestId}', [FriendController::class, 'cancelRequest']);
    Route::delete('/friends/{friendId}', [FriendController::class, 'unfriend']);
});