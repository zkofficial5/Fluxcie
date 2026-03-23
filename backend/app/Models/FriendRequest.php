<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FriendRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'from_user_id',
        'to_user_id',
        'status',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function fromUser()
    {
        return $this->belongsTo(User::class, 'from_user_id');
    }

    public function toUser()
    {
        return $this->belongsTo(User::class, 'to_user_id');
    }

    // Methods
    public function accept()
    {
        $this->status = 'accepted';
        $this->save();

        // Create friendship records
        Friendship::create([
            'user_id' => $this->from_user_id,
            'friend_id' => $this->to_user_id,
        ]);

        Friendship::create([
            'user_id' => $this->to_user_id,
            'friend_id' => $this->from_user_id,
        ]);
    }

    public function decline()
    {
        $this->status = 'declined';
        $this->save();
    }

    public function isPending()
    {
        return $this->status === 'pending';
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeAccepted($query)
    {
        return $query->where('status', 'accepted');
    }
}