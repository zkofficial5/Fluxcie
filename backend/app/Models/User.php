<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'avatar',
        'status',
        'last_seen',
        'bio',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'last_seen' => 'datetime',
        ];
    }

    /**
     * Get all conversations this user is part of
     */
    public function conversations(): BelongsToMany
    {
        return $this->belongsToMany(Conversation::class, 'conversation_user')
            ->withPivot('unread_count')
            ->withTimestamps();
    }

    /**
     * Get all messages sent by this user
     */
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    /**
     * Get all friend requests sent by this user
     */
    public function sentFriendRequests(): HasMany
    {
        return $this->hasMany(FriendRequest::class, 'from_user_id');
    }

    /**
     * Get all friend requests received by this user
     */
    public function receivedFriendRequests(): HasMany
    {
        return $this->hasMany(FriendRequest::class, 'to_user_id');
    }

    /**
     * Get all friendships (where this user is the owner)
     */
    public function friendships(): HasMany
    {
        return $this->hasMany(Friendship::class, 'user_id');
    }

    /**
     * Get all friends of this user
     */
    public function friends()
    {
        return $this->hasMany(Friendship::class, 'user_id')->with('friend');
    }

    /**
     * Check if this user is friends with another user
     */
    public function isFriendsWith($userId): bool
    {
        return Friendship::areFriends($this->id, $userId);
    }

    /**
     * Send friend request to another user
     */
    public function sendFriendRequestTo($userId): FriendRequest
    {
        return FriendRequest::create([
            'from_user_id' => $this->id,
            'to_user_id' => $userId,
            'status' => 'pending',
        ]);
    }

    /**
     * Update user's online status
     */
    public function updateStatus($status): void
    {
        $this->status = $status;
        
        if ($status === 'offline') {
            $this->last_seen = now();
        }
        
        $this->save();
    }

    /**
     * Get user's total unread message count
     */
    public function getTotalUnreadCount(): int
    {
        return $this->conversations()
            ->sum('conversation_user.unread_count');
    }
}