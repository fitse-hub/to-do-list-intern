<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'category_id',
        'completed',
        'start_date',
        'due_date',
        'priority',
        'user_id',
        'completed_at',
    ];

    protected $casts = [
        'completed'  => 'boolean',
        'start_date' => 'datetime',
        'due_date'   => 'datetime',
        'completed_at' => 'datetime',
        'priority'  => 'string',
    ];

    /**
     * Append computed attributes to JSON
     */
    protected $appends = ['status'];

    /**
     * Computed status attribute
     * Returns: 'completed', 'todo', or 'failed'
     */
    protected function status(): Attribute
    {
        return Attribute::make(
            get: function () {
                // If task is completed, status is always 'completed'
                if ($this->completed) {
                    return 'completed';
                }

                // If no due date, status is 'todo'
                if (!$this->due_date) {
                    return 'todo';
                }

                // If due date is in the past, status is 'failed'
                if ($this->due_date->isPast()) {
                    return 'failed';
                }

                // Otherwise, status is 'todo'
                return 'todo';
            }
        );
    }

    /**
     * Check if task is overdue
     */
    public function isOverdue(): bool
    {
        return !$this->completed &&
               $this->due_date &&
               $this->due_date->isPast();
    }

    /**
     * A task belongs to one user
     *
     * Usage: $task->user->name
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * A task belongs to one category
     *
     * Usage: $task->category->name
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
