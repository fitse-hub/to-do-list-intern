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
            // Add user_id column after id
            // foreignId creates a BIGINT UNSIGNED column
            // constrained() creates foreign key to users table
            // onDelete('cascade') means: if user is deleted, delete their tasks too
            $table->foreignId('user_id')
                  ->after('id')
                  ->constrained()
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            // Remove the foreign key constraint first
            $table->dropForeign(['user_id']);
            // Then remove the column
            $table->dropColumn('user_id');
        });
    }
};
