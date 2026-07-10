<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        return response()->json($request->user()->categories);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50',
        ]);

        // Check if category already exists for this user
        $existingCategory = $request->user()->categories()
            ->where('name', $validated['name'])
            ->first();

        if ($existingCategory) {
            return response()->json([
                'message' => 'A category with this name already exists.',
                'error' => 'duplicate_category'
            ], 422); // 422 Unprocessable Entity
        }

        $category = $request->user()->categories()->create([
            'name' => $validated['name'],
        ]);

        return response()->json($category, 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50',
        ]);

        $category = $request->user()->categories()->find($id);

        if (!$category) {
            return response()->json(['message' => 'Category not found.'], 404);
        }

        // Check if another category already exists with this name for this user
        $existingCategory = $request->user()->categories()
            ->where('name', $validated['name'])
            ->where('id', '!=', $id)
            ->first();

        if ($existingCategory) {
            return response()->json([
                'message' => 'A category with this name already exists.',
                'error' => 'duplicate_category'
            ], 422);
        }

        $category->name = $validated['name'];
        $category->save();

        return response()->json($category);
    }
}
