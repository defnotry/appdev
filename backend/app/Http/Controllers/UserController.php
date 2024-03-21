<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function getUsers()
    {
        $users = User::all();
        return response()->json($users);
    }

    public function createUser(Request $request)
    {
        $user = new User();
        $user->name = $request->input('name');
        $user->email = $request->input('email');
        $user->password = $request->input('password');
        $user->role = $request->input('role');
        $user->save();
        
        return response()->json($user);
    }
    
    public function getUser($id)
    {
        $user = User::find($id);
        return response()->json($user);
    }
    
    public function updateUser(Request $request, $id)
    {
        $user = User::find($id);
        $user->name = $request->input('name');
        $user->email = $request->input('email');
        $user->password = $request->input('password');
        $user->role = $request->input('role');
        $user->save();

        return response()->json($user);
    }

    public function deleteUser($id)
    {
        $user = User::find($id);
        $user->delete();

        return response()->json(['message' => 'User deleted']);
    }


    // Approve Artists

    public function approveArtist($id)
    {
        $user = User::find($id);
        $user->is_approved = true;
        $user->save();

        return response()->json($user);
    }
}