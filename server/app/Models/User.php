<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // Add Sanctum for API tokens

#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasApiTokens; // Add HasApiTokens trait

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
        ];
    }

    public function categories()
    {
        return $this->hasMany(Category::class);
    }

    protected static function booted()
    {
        static::created(function ($user) {
            // Automatically seed default categories for new users
            $defaultCategories = ['General', 'Work', 'Personal', 'Urgent'];
            foreach ($defaultCategories as $categoryName) {
                $user->categories()->create(['name' => $categoryName]);
            }
        });
    }

    /**
     * A user has many tasks
     *
     * Usage: $user->tasks()->get()
     */
    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }
}
