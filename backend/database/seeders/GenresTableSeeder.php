<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class GenresTableSeeder extends Seeder
{
    public function run()
    {
        if (DB::table('genres')->count() > 0) {
            return;
        }
    
        $genres = [
            'Pop',
            'Rock',
            'Jazz',
            'Classical',
            'Country',
            'Hip Hop/Rap',
            'Electronic/Dance',
            'R&B/Soul',
            'Reggae',
            'Blues',
            'Folk',
            'Indie',
            'Metal',
            'Punk',
            'Alternative',
            'Gospel',
            'Funk',
            'Disco',
            'Techno',
            'House',
            'Ambient',
            'Dubstep',
            'Ska',
            'Grunge',
            'New Wave',
            'Shoegaze',
            'Psychedelic',
            'Reggaeton',
            'Salsa',
            'Bossa Nova',
            'Flamenco',
            'Samba',
            'Mariachi',
            'Tango',
            'Opera',
            'Baroque',
            'Romantic',
            'Renaissance',
            'Electronicore',
            'Industrial',
            'Goth',
            'Synthpop',
            'Trance',
            'Drum and Bass (D&B)',
            'Breakbeat',
            'Garage',
            'Hardstyle',
            'Hardcore',
            'Gabber',
            'Ambient House',
            'Acid House',
            'Deep House',
            'Tech House',
            'Progressive House',
            'Electro House',
            'Big Room House',
            'Eurodance',
            'Hi-NRG',
            'Italo Disco',
            'Detroit Techno',
            'Minimal Techno',
            'Acid Techno',
            'Psytrance',
            'Chillout',
            'Downtempo',
            'Lounge',
            'Trip Hop',
            'IDM (Intelligent Dance Music)',
            'Vaporwave',
            'Chillwave',
            'Synthwave',
            'Nu-Disco',
            'Afrobeat',
            'Dancehall',
            'Dub',
            'Roots Reggae',
            'Dance Pop',
            'Latin Pop',
            'K-Pop',
            'J-Pop',
            'C-Pop',
            'Brazilian Music',
            'African Music',
            'Indian Music',
            'Middle Eastern Music',
            'Celtic Music',
            'Bluegrass',
            'Americana',
            'World Music',
            'Experimental Music',
            'Noise',
            'Avant-Garde',
            'Post-Rock',
            'Post-Punk',
            'Post-Hardcore',
            'Math Rock',
            'Dream Pop',
            'Grindcore',
            'Deathcore'
        ];
        
    
        foreach ($genres as $genre) {
            DB::table('genres')->insert([
                'name' => $genre,
            ]);
        }
    }
}
