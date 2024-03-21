<?php

namespace App\Http\Controllers;

use App\Models\Song;
use App\Models\User;
use App\Models\Album;
use App\Jobs\CreateAlbumAndUploadSongsJob;
use App\Jobs\CreateAlbumJob;
use App\Jobs\UploadSongJob;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class ArtistController extends Controller
{
    public function getArtist($id)
    {
    $artist = User::find($id);

    if ($artist) {
        return response()->json($artist);
    } else {
        return response()->json(['error' => 'Artist not found'], 404);
    }
    }

    public function getArtists(Request $request)
    {
        $artists = User::where('role', 'artist')->get();

        return response()->json($artists);
    }

    public function getAlbums(Request $request)
    {
        $user = auth()->user();
        $albums = $user->albums;

        return response()->json($albums);
    }
    
    public function getArtistSongs($id)
    {
        $user = User::find($id);
        if ($user) {
            $songs = $user->songs()->with('user')->get();
            return response()->json($songs);
        } else {
            return response()->json(['error' => 'User not found'], 404);
        }
    }

    public function uploadSong(Request $request)
    {
        if (!$request->hasFile('song')) {
            return response()->json(['message' => 'Song file is empty'], 400);
        }
    
        $request->validate([
            'display_name' => 'required',
            'song' => 'required|file|mimes:mp3,wav,ogg|max:40000',
            'album_id' => 'required|exists:albums,album_id',
        ]);
    
        $currentTime = time();
        $hashedTime = hash('sha256', $currentTime);
        $songExtension = $request->file('song')->getClientOriginalExtension();
        $hashedSongName = $hashedTime . '.' . $songExtension;
        $request->file('song')->storeAs('songs', $hashedSongName, 'public');
    
        $song = new Song;
        $song->display_name = $request->display_name;
        $song->hashed_name = $hashedSongName;
        $song->user_id = auth()->id();
        $song->album_id = $request->album_id; 
    
        $song->save();
    
        return response()->json(['message' => 'Song Uploaded Successfully'], 201);
    }

    public function deleteSong(Request $request, $id)
    {
        $song = Song::find($id);

        if ($song && auth()->id() == $song->user_id) {
            Storage::delete('songs/' . $song->hashed_name);
            $song->delete();
        }

        return response()->json(null, 204);
    }

    public function createAlbum(Request $request)
    {
        $request->validate([
            'album_name' => 'required',
            'album_description' => 'required',
            'album_photo' => 'required|file|mimes:jpeg,png,jpg,gif',
            // 'is_published' => 'required|boolean',
            'release_date' => 'nullable|date',
        ]);
    
        $currentTime = time();
        $hashedTime = hash('sha256', $currentTime);
        $photoExtension = $request->file('album_photo')->getClientOriginalExtension();
        $hashedPhotoName = $hashedTime . '.' . $photoExtension;
    
        $album = new Album;
        $album->album_name = $request->album_name;
        $album->album_description = $request->album_description;
        $album->cover_photo_hash = $hashedPhotoName;
        $album->user_id = auth()->id();
        $album->is_published = $request->is_published;
        $album->release_date = $request->release_date;
    
        $request->file('album_photo')->storeAs('album_images', $hashedPhotoName, 'public');
    
        $album->save();
    
        return response()->json(['message' => 'Album Created Successfully'], 201);
    }

    public function editAlbum(Request $request, $id)
    {
        $request->validate([
            'album_name' => 'required',
            'album_description' => 'required',
        ]);

        $album = Album::find($id);

        if ($album && auth()->id() == $album->user_id) {
            $album->album_name = $request->album_name;
            $album->album_description = $request->album_description;
            $album->save();
        }

        return response()->json($album);
    }

    public function editSong(Request $request, $id)
    {
        $request->validate([
            'display_name' => 'required',
        ]);

        $song = Song::find($id);

        if ($song && auth()->id() == $song->user_id) {
            $song->display_name = $request->display_name;
            $song->save();
        }

        return response()->json($song);
    }

    public function createAlbumAndUploadSongs(Request $request)
    {
        $validatedData = $request->validate([
            'album_name' => 'required',
            'album_description' => 'required',
            'album_photo' => 'required|file|mimes:jpeg,png,jpg,gif',
            'songs' => 'required|array',
            'songs.*' => 'file|mimes:mp3,wav,ogg|max:40000',
            'genres' => 'required|array',
            'genres.*' => 'required|exists:genres,id',
        ]);
    
        $currentTime = time();
        $hashedTime = hash('sha256', $currentTime);
        $photoExtension = $request->file('album_photo')->getClientOriginalExtension();
        $hashedPhotoName = $hashedTime . '.' . $photoExtension;
    
        $request->file('album_photo')->storeAs('album_images', $hashedPhotoName, 'public');
    
        $album = new Album;
        $album->album_name = $validatedData['album_name'];
        $album->album_description = $validatedData['album_description'];
        $album->cover_photo_hash = $hashedPhotoName;
        $album->user_id = auth()->id();
        $album->save();
    
        $displayNames = $request->input('displayNames');

        foreach ($request->file('songs') as $index => $song) {
            $currentTime = time();
            $hashedTime = hash('sha256', $song->getClientOriginalName() . $currentTime);
            $songExtension = $song->getClientOriginalExtension();
            $hashedSongName = $hashedTime . '.' . $songExtension;
        
            $songPath = $song->storeAs('songs', $hashedSongName, 'public');
        
            $displayName = $displayNames[$index];
            $genres = $request->input('genres')[$index];
            
            UploadSongJob::dispatch($songPath, $album->album_id, $displayName, $hashedSongName, $genres);
        }
    
        return response()->json(['message' => 'Album created and songs upload requested'], 200);
    }
}
