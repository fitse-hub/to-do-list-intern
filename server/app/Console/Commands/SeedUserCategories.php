<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class SeedUserCategories extends Command
{
    protected $signature   = 'categories:seed';
    protected $description = 'Seed default categories (General, Work, Personal, Urgent) for all existing users that have none.';

    public function handle()
    {
        $defaultCategories = ['General', 'Work', 'Personal', 'Urgent'];

        $users = User::all();

        foreach ($users as $user) {
            // Only seed if this user has zero categories
            if ($user->categories()->count() === 0) {
                foreach ($defaultCategories as $name) {
                    $user->categories()->create(['name' => $name]);
                }
                $this->info("Seeded categories for user: {$user->email}");
            } else {
                $this->line("Skipping user {$user->email} — already has categories.");
            }
        }

        $this->info('Done seeding default categories.');
    }
}
