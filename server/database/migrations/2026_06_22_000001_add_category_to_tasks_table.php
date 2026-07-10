<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add category column to tasks table.
     */
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            // Add category after title, default to 'General'
            $table->string('category')->default('General')->after('title');
        });
    }

    /**
     * Reverse the migration.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropColumn('category');
        });
    }
};
