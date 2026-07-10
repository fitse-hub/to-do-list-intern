<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('categories:seed-defaults')]
#[Description('Seed default categories (General, Work, Personal, Urgent) for all users who don\'t have them')]
class SeedDefaultCategories extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting to seed default categories for users...');

        $defaultCategories = ['General', 'Work', 'Personal', 'Urgent'];

        // Get all users
        $users = User::all();

        if ($users->isEmpty()) {
            $this->warn('No users found in the database.');
            return Command::SUCCESS;
        }

        $this->info("Found {$users->count()} user(s) in the database.");

        $usersProcessed = 0;
        $categoriesCreated = 0;

        foreach ($users as $user) {
            $this->line("Processing user: {$user->name} (ID: {$user->id})");

            // Get existing category names for this user
            $existingCategories = $user->categories->pluck('name')->toArray();

            $userCategoriesAdded = 0;

            // Only add categories that don't exist yet
            foreach ($defaultCategories as $categoryName) {
                if (!in_array($categoryName, $existingCategories)) {
                    $user->categories()->create(['name' => $categoryName]);
                    $userCategoriesAdded++;
                    $categoriesCreated++;
                    $this->comment("  ✓ Created category: {$categoryName}");
                } else {
                    $this->comment("  - Category already exists: {$categoryName}");
                }
            }

            if ($userCategoriesAdded > 0) {
                $usersProcessed++;
            }

            $this->newLine();
        }

        $this->newLine();
        $this->info('═══════════════════════════════════════');
        $this->info('Summary:');
        $this->info("  • Total users: {$users->count()}");
        $this->info("  • Users updated: {$usersProcessed}");
        $this->info("  • Categories created: {$categoriesCreated}");
        $this->info('═══════════════════════════════════════');
        $this->info('✓ Default categories seeded successfully!');

        return Command::SUCCESS;
    }
}
