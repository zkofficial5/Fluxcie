<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Friendship extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'friend_id',
    ];

    /**
     * Get the user who owns this friendship
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the friend in this friendship
     */
    public function friend(): BelongsTo
    {
        return $this->belongsTo(User::class, 'friend_id');
    }

    /**
     * Check if two users are friends
     */
    public static function areFriends($userId, $friendId): bool
    {
        return self::where('user_id', $userId)
            ->where('friend_id', $friendId)
            ->exists();
    }

    /**
     * Unfriend (remove both friendship records)
     */
    public static function unfriend($userId, $friendId): void
    {
        self::where('user_id', $userId)
            ->where('friend_id', $friendId)
            ->delete();

        self::where('user_id', $friendId)
            ->where('friend_id', $userId)
            ->delete();
    }
}