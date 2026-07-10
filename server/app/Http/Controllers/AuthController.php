<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * ============================================
     * STEP 1: REGISTER - Create New User
     * ============================================
     *
     * What happens:
     * 1. Validate incoming data (name, email, password)
     * 2. Create user in database
     * 3. Generate authentication token
     * 4. Return user data + token
     *
     * Postman Test:
     * POST http://localhost:8000/api/register
     * Body (JSON):
     * {
     *   "name": "John Doe",
     *   "email": "john@example.com",
     *   "password": "password123",
     *   "password_confirmation": "password123"
     * }
     */
    public function register(Request $request)
    {
        // Validate the request data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed', // confirmed means password_confirmation must match
        ]);

        // Create the user (password automatically hashed by User model)
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'], // Auto-hashed in User model
        ]);

        // Create authentication token for this user
        // 'auth_token' is just a name - you can call it anything
        $token = $user->createToken('auth_token')->plainTextToken;

        // Return response with user data and token
        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
            'token' => $token,
        ], 201); // 201 = Created
    }

    /**
     * ============================================
     * STEP 2: LOGIN - Authenticate Existing User
     * ============================================
     *
     * What happens:
     * 1. Find user by email
     * 2. Check if password is correct
     * 3. If correct: generate token
     * 4. Return user data + token
     *
     * Postman Test:
     * POST http://localhost:8000/api/login
     * Body (JSON):
     * {
     *   "email": "john@example.com",
     *   "password": "password123"
     * }
     */
    public function login(Request $request)
    {
        // Validate login credentials
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Find user by email
        $user = User::where('email', $request->email)->first();

        // Check if user exists AND password is correct
        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Create new token for this login session
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
        ], 200); // 200 = OK
    }

    /**
     * ============================================
     * STEP 3: LOGOUT - Delete User's Token
     * ============================================
     *
     * What happens:
     * 1. Get currently authenticated user
     * 2. Delete their current token
     * 3. User must login again to get new token
     *
     * Postman Test:
     * POST http://localhost:8000/api/logout
     * Headers:
     * Authorization: Bearer YOUR_TOKEN_HERE
     */
    public function logout(Request $request)
    {
        // Delete the token that was used to authenticate this request
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ], 200);
    }

    /**
     * ============================================
     * STEP 4: ME - Get Current User Info
     * ============================================
     *
     * What happens:
     * 1. Get currently authenticated user
     * 2. Return their information
     *
     * Postman Test:
     * GET http://localhost:8000/api/me
     * Headers:
     * Authorization: Bearer YOUR_TOKEN_HERE
     */
    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user(),
        ], 200);
    }

    /**
     * ============================================
     * STEP 5: UPDATE PROFILE - Change User Info
     * ============================================
     *
     * What happens:
     * 1. Get currently authenticated user
     * 2. Validate incoming data
     * 3. Update user information
     *
     * Postman Test:
     * PUT http://localhost:8000/api/me
     * Headers:
     * Authorization: Bearer YOUR_TOKEN_HERE
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'current_password' => 'required_with:password|current_password',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        $user->name = $validated['name'];
        // Email is intentionally not updated to keep it locked

        if (!empty($validated['password'])) {
            $user->password = $validated['password'];
        }

        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user,
        ], 200);
    }
}
