<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * ============================================
     * GET ALL TASKS - Only Current User's Tasks
     * ============================================
     *
     * Before Auth: Task::all() - Shows ALL tasks from ALL users
     * After Auth: auth()->user()->tasks - Shows ONLY logged-in user's tasks
     *
     * Postman Test:
     * GET http://localhost:8000/api/tasks
     * Headers:
     * Authorization: Bearer YOUR_TOKEN_HERE
     */
    public function index(Request $request)
    {
        // Get only the authenticated user's tasks with category relationship
        $tasks = $request->user()->tasks()->with('category')->get();

        return response()->json($tasks);
    }

    /**
     * ============================================
     * CREATE TASK - Assign to Current User
     * ============================================
     *
     * Before Auth: Task::create() - Task has no owner
     * After Auth: user()->tasks()->create() - Task belongs to logged-in user
     *
     * Postman Test:
     * POST http://localhost:8000/api/tasks
     * Headers:
     * Authorization: Bearer YOUR_TOKEN_HERE
     * Body (JSON):
     * {
     *   "title": "Buy groceries",
     *   "category_id": 1,
     *   "due_date": "2026-07-30",
     *   "completed": false
     * }
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|min:3|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'start_date'  => 'nullable|date',
            'due_date'    => 'nullable|date',
            'priority'    => 'nullable|in:low,medium,high',
            'completed'   => 'boolean'
        ]);

        // If category_id is provided, verify it belongs to the user
        if (isset($validated['category_id'])) {
            $category = $request->user()->categories()->find($validated['category_id']);
            if (!$category) {
                return response()->json([
                    'message' => 'Category not found or does not belong to you'
                ], 404);
            }
        }

        // Create task and automatically assign to authenticated user
        $task = $request->user()->tasks()->create([
            'title'       => $validated['title'],
            'category_id' => $validated['category_id'] ?? null,
            'start_date'  => $validated['start_date'] ?? now(),
            'due_date'    => $validated['due_date'] ?? null,
            'priority'    => $validated['priority'] ?? null,
            'completed'   => $validated['completed'] ?? false,
            'completed_at' => ($validated['completed'] ?? false) ? now() : null,
        ]);

        // Load the category relationship for the response
        $task->load('category');

        return response()->json($task, 201);
    }

    /**
     * ============================================
     * UPDATE TASK - Only User's Own Task
     * ============================================
     *
     * Security: User can only update their own tasks
     * If task belongs to another user → 404 Not Found
     *
     * Postman Test:
     * PUT http://localhost:8000/api/tasks/1
     * Headers:
     * Authorization: Bearer YOUR_TOKEN_HERE
     * Body (JSON):
     * {
     *   "title": "Buy groceries and fruits",
     *   "category_id": 2,
     *   "due_date": "2026-08-15",
     *   "completed": true
     * }
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title'       => 'required|string|min:3|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'start_date'  => 'nullable|date',
            'due_date'    => 'nullable|date',
            'priority'    => 'nullable|in:low,medium,high',
            'completed'   => 'boolean',
        ]);

        // Find task ONLY in authenticated user's tasks
        // If task doesn't exist or belongs to another user → 404
        $task = $request->user()->tasks()->findOrFail($id);

        // If category_id is provided, verify it belongs to the user
        if (isset($validated['category_id'])) {
            $category = $request->user()->categories()->find($validated['category_id']);
            if (!$category) {
                return response()->json([
                    'message' => 'Category not found or does not belong to you'
                ], 404);
            }
        }

        $task->update([
            'title'       => $validated['title'],
            'category_id' => $validated['category_id'] ?? $task->category_id,
            'start_date'  => array_key_exists('start_date', $validated) ? $validated['start_date'] : $task->start_date,
            'due_date'    => array_key_exists('due_date', $validated) ? $validated['due_date'] : $task->due_date,
            'priority'    => array_key_exists('priority', $validated) ? $validated['priority'] : $task->priority,
            'completed'   => $validated['completed'],
            'completed_at' => $validated['completed'] ? ($task->completed_at ?? now()) : null
        ]);

        // Load the category relationship for the response
        $task->load('category');

        return response()->json($task);
    }

    /**
     * ============================================
     * DELETE TASK - Only User's Own Task
     * ============================================
     *
     * Security: User can only delete their own tasks
     *
     * Postman Test:
     * DELETE http://localhost:8000/api/tasks/1
     * Headers:
     * Authorization: Bearer YOUR_TOKEN_HERE
     */
    public function destroy(Request $request, $id)
    {
        // Find task ONLY in authenticated user's tasks
        $task = $request->user()->tasks()->findOrFail($id);

        $task->delete();

        return response()->json([
            'message' => 'Task deleted successfully'
        ]);
    }

    /**
     * ============================================
     * TOGGLE TASK - Only User's Own Task
     * ============================================
     *
     * Toggle completed status: true → false, false → true
     *
     * Postman Test:
     * PATCH http://localhost:8000/api/tasks/1/toggle
     * Headers:
     * Authorization: Bearer YOUR_TOKEN_HERE
     */
    public function toggle(Request $request, $id)
    {
        // Find task ONLY in authenticated user's tasks
        $task = $request->user()->tasks()->findOrFail($id);

        $task->completed = !$task->completed;
        $task->completed_at = $task->completed ? now() : null;
        $task->save();

        // Load the category relationship for the response
        $task->load('category');

        return response()->json($task);
    }
}
