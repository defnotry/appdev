<?php

namespace App\Jobs;

use App\Models\Album;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class CreateAlbumJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $albumName;
    protected $albumDescription;
    protected $albumPhotoPath;

    public function __construct($albumName, $albumDescription, $albumPhotoPath)
    {
        $this->albumName = $albumName;
        $this->albumDescription = $albumDescription;
        $this->albumPhotoPath = $albumPhotoPath;
    }

    public function handle()
    {
        $currentTime = time();
        $hashedTime = hash('sha256', $currentTime);
        $photoExtension = pathinfo(Storage::url($this->albumPhotoPath), PATHINFO_EXTENSION);
        $hashedPhotoName = $hashedTime . '.' . $photoExtension;
    
        // Move the album photo from the temporary location to the final location
        Storage::move($this->albumPhotoPath, 'album_images/' . $hashedPhotoName);
    
        $album = new Album;
        $album->album_name = $this->albumName;
        $album->album_description = $this->albumDescription;
        $album->user_id = auth()->id();
        $album->cover_photo_hash = $hashedPhotoName;
        $album->save();
    }
}
