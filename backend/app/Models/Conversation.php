<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Conversation extends Model
{
    use HasFactory;

    protected $fillable = [
        'is_group',
        'group_name',
        'group_avatar',
        'muted_until',
        'mute_type',
    ];

    protected $casts = [
        'is_group' => 'boolean',
        'muted_until' => 'datetime',
    ];

    /**
     * Get all participants in this conversation
     */
    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'conversation_user')
            ->withPivot('unread_count')
            ->withTimestamps();
    }

    /**
     * Get all messages in this conversation
     */
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class)->orderBy('created_at', 'asc');
    }

    /**
     * Get the last message in this conversation
     */
    public function lastMessage()
    {
        return $this->hasOne(Message::class)->latestOfMany();
    }

    /**
     * Get unread count for a specific user
     */
    public function getUnreadCountForUser($userId): int
    {
        return $this->participants()
            ->where('user_id', $userId)
            ->first()
            ->pivot
            ->unread_count ?? 0;
    }

    /**
     * Mark messages as read for a user
     */
    public function markAsReadForUser($userId): void
    {
        $this->participants()
            ->updateExistingPivot($userId, ['unread_count' => 0]);
    }

    /**
     * Increment unread count for all participants except sender
     */
    public function incrementUnreadForOthers($senderId): void
    {
        $this->participants()
            ->where('user_id', '!=', $senderId)
            ->increment('unread_count');
    }
}