<?php

namespace App\Http\Controllers;

use App\Models\ArtistRequest;
use Illuminate\Http\Request;

class ArtistRequestController extends Controller
{
    public function getArtistRequests()
    {
        $artistRequests = ArtistRequest::all();
        return response()->json($artistRequests);
    }
}
