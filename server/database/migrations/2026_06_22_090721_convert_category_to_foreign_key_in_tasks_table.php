<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            // Drop the old category string column
            $table->dropColumn('category');

            // Add category_id foreign key, nullable at first
            $table->foreignId('category_id')->nullable()->after('title')->constrained()->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            // Remove foreign key and category_id column
            $table->dropForeign(['category_id']);
            $table->dropColumn('category_id');

            // Restore the old category string column
            $table->string('category')->default('General')->after('title');
        });
    }
};
