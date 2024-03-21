<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Song;
use App\Album;
use Illuminate\Http\Request;

class CreateAlbumAndUploadSongsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $data;

    /**
     * Create a new job instance.
     */
    public function __construct(array $data)
    {
        $this->data = $data;
    }

    /**
     * Execute the job.
     */
    public function handle()
    {
        // Album creation

        $currentTime = time();
        $hashedTime = hash('sha256', $currentTime);
        $photoExtension = $this->data['album_photo']->getClientOriginalExtension();
        $hashedPhotoName = $hashedTime . '.' . $photoExtension;
    
        $album = new Album;
        $album->album_name = $this->data['album_name'];
        $album->album_description = $this->data['album_description'];
        $album->cover_photo_hash = $hashedPhotoName;
        $album->user_id = auth()->id();
        $album->is_published = $this->data['is_published'];
        $album->release_date = $this->data['release_date'];
    
        $this->data['album_photo']->storeAs('album_images', $hashedPhotoName, 'public');
    
        $album->save();

        // Song uploading
        foreach ($this->data['songs'] as $songRequest) {
    
            $currentTime = time();
            $hashedTime = hash('sha256', $currentTime);
            $songExtension = $songRequest->getClientOriginalExtension();
            $hashedSongName = $hashedTime . '.' . $songExtension;
            $songRequest->storeAs('songs', $hashedSongName, 'public');
    
            $song = new Song;
            $song->display_name = $songRequest->getClientOriginalName(); // You need to find a way to pass the display names for the songs
            $song->hashed_name = $hashedSongName;
            $song->user_id = auth()->id();
            $song->album_id = $album->id; 
    
            $song->save();
        }

    }
}
