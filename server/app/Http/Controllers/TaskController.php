<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tasks = Task::all();
        return response()->json($tasks);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate(['title' => 'required|string|min:3|max:255', 'completed' => 'boolean']);
        $task = Task::create([ 'title' => $validated['title'], 'completed' => $validated['completed'] ?? false,
        ]);
        return response()->json($task, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
{

    $validated = $request->validate([
        'title' => 'required|string|min:3|max:255',
        'completed' => 'boolean',
    ]);

    $task = Task::findOrFail($id);

    $task->update([
        'title' => $validated['title'],
        'completed' => $validated['completed']
    ]);

    return response()->json($task);
}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
{
    $task = Task::findOrFail($id);

    $task->delete();

    return response()->json([
        'message' => 'Task deleted successfully'
    ]);
}

    public function toggle($id)
{
    $task = Task::findOrFail($id);

    $task->completed = !$task->completed;

    $task->save();

    return response()->json($task);
}
}
