<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ArtistRequestController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ArtistController;
use App\Http\Controllers\SongController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('login', [AuthController::class, 'login']); // Check role, then redirect accordingly
Route::post('register-listener', [AuthController::class, 'registerListener']);
Route::post('register-artist', [AuthController::class, 'registerArtist']);
Route::post('resend-verification-email', [AuthController::class, 'sendVerificationEmail']);

Route::get('users', [UserController::class, 'getUsers']);
Route::get('artist-requests', [ArtistRequestController::class, 'getArtistRequests']);
Route::get('users/{id}', [UserController::class, 'getUser']);
Route::put('users/{id}', [UserController::class, 'updateUser']);
Route::delete('users/{id}', [UserController::class, 'deleteUser']);

Route::get('albums', [ArtistController::class, 'getAlbums']);
Route::get('artists', [ArtistController::class, 'getArtists']);
Route::get('/artists/{id}', [ArtistController::class, 'getArtist']);
Route::get('/play/{filename}', [SongController::class, 'getSong']);
Route::get('genres', [SongController::class, 'getGenres']);
Route::get('/songs/{id}', [ArtistController::class, 'getArtistSongs']);
Route::post('upload-song', [ArtistController::class, 'uploadSong']);
Route::post('create/album', [ArtistController::class, 'createAlbum']);
Route::post('create/album/upload-songs', [ArtistController::class, 'createAlbumAndUploadSongs']);
Route::delete('songs/{id}', [ArtistController::class, 'deleteSong']);
Route::put('albums/{id}', [ArtistController::class, 'editAlbum']);
Route::put('songs/{id}', [ArtistController::class, 'editSong']);

Route::group([

    'middleware' => 'api',
    'prefix' => 'auth'

], function ($router) {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::get('me', [AuthController::class, 'me']);

    // Artist

    
    Route::get('email/verify/{id}', function (Request $request, $id) {
        $user = App\Models\User::find($id);

        if (!$user) {
            abort(404);
        }

        $user->markEmailAsVerified();

        return redirect(env('FRONT_END_URL') . '/home');
    })->name('verification.verify');
});



