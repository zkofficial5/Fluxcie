<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'conversation_id',
        'sender_id',
        'content',
        'type',
        'read',
        'deleted',
        'reactions',
        'reply_to',
        'voice_duration',
        'file_path',
        'file_name',
        'file_size',
    ];

    protected $casts = [
        'read' => 'boolean',
        'deleted' => 'boolean',
        'reactions' => 'array', // JSON array
        'voice_duration' => 'integer',
        'file_size' => 'integer',
    ];

    /**
     * Get the conversation this message belongs to
     */
    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class);
    }

    /**
     * Get the sender of this message
     */
    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    /**
     * Get the message this is replying to
     */
    public function replyToMessage(): BelongsTo
    {
        return $this->belongsTo(Message::class, 'reply_to');
    }

    /**
     * Get all replies to this message
     */
    public function replies()
    {
        return $this->hasMany(Message::class, 'reply_to');
    }

    /**
     * Add a reaction to this message
     */
    public function addReaction(string $emoji): void
    {
        $reactions = $this->reactions ?? [];
        $reactions[] = $emoji;
        $this->reactions = $reactions;
        $this->save();
    }

    /**
     * Remove a reaction from this message
     */
    public function removeReaction(string $emoji): void
    {
        $reactions = $this->reactions ?? [];
        $key = array_search($emoji, $reactions);
        
        if ($key !== false) {
            unset($reactions[$key]);
            $this->reactions = array_values($reactions);
            $this->save();
        }
    }

    /**
     * Soft delete message (mark as deleted)
     */
    public function softDelete(): void
    {
        $this->deleted = true;
        $this->save();
    }
}