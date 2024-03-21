<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MusicController extends Controller
{
    public function createMusic()
    {
        if (auth()->user()->can('create-music')) {
            // The user is allowed to create music
            // Add your music creation logic here
        } else {
            abort(403);
        }
    }
}