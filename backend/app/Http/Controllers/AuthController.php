<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\ArtistRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Illuminate\Validation\Rules\Password;
use App\Http\Controllers\Controller;

use App\Mail\ContactFormMail;
use App\Mail\VerificationEmail;

class AuthController extends Controller 
{

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login()
    {
        $credentials = request(['email', 'password']);
    
        if (!$token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    
        // Get the authenticated user
        $user = auth()->user();
    
        // Check if the user is an admin or superadmin
        $isAdmin = $user->role === 'admin' || $user->role === 'superadmin';
    
        return $this->respondWithToken($token, $isAdmin);
    }

    public function registerListener(Request $request)
    {
        $request->validate([
            'name' => 'required|string|min:4|unique:users,name',
            'email' => 'required|email|unique:users,email',
            'password' => [
                'required',
                Password::min(8)
                    ->mixedCase() 
                    ->letters() 
                    ->numbers() 
            ],
            'confirmPassword' => 'required|same:password',
            'profilePicture' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->role = 'listener';

        if ($request->hasFile('profilePicture')) {
            $currentTime = time();
            $hashedTime = hash('sha256', $currentTime);
            $extension = $request->file('profilePicture')->getClientOriginalExtension();
            $request->file('profilePicture')->storeAs('profile_pics', $hashedTime . '.' . $extension, 'public');
            $profilePicName = $hashedTime . '.' . $extension;
            $user->profile_pic_name = $profilePicName;
        }

        $user->save();

        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify', now()->addMinutes(60), ['id' => $user->id]
        );

        Mail::to($user->email)->send(new VerificationEmail($verificationUrl,$user->name));

        
        return response()->json(['message' => 'User registered successfully'], 201);
    }

    public function registerArtist(Request $request)
    {
        $request->validate([
            'name' => 'required|string|min:4|unique:users,name',
            'email' => 'required|email|unique:users,email',
            'password' => [
                'required',
                Password::min(8)
                    ->mixedCase()
                    ->letters() 
                    ->numbers()
            ],
            'confirmPassword' => 'required|same:password'
        ]);

        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->role = 'artist';
        $user->save();

        $verifyRequest = new ArtistRequest();
        $verifyRequest->id = $user->id;
        $verifyRequest->username = $user->name;
        $verifyRequest->email = $user->email;
        $verifyRequest->is_approved = false;
        $verifyRequest->save(); 

        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify', now()->addMinutes(60), ['id' => $user->id]
        );

        Mail::to($user->email)->send(new VerificationEmail($verificationUrl,$user->name)); 
        
        return response()->json(['message' => 'User registered successfully'], 201);
    }
    
    public function sendVerificationEmail(Request $request) {
        $user = auth()->user();
            
        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify', now()->addMinutes(60), ['id' => $user->id]
        );

        Mail::to($user->email)->send(new VerificationEmail($verificationUrl,$user->name));

        return response()->json(['message' => 'Email sent successfully'], 201);
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        $user = auth()->user();
    
        if (!$user) {
            $user = ['name' => 'Guest'];
        }
    
        return response()->json($user);
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(auth()->refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token, $isAdmin)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
            'is_admin' => $isAdmin
        ]);
    }
}
