<?php

namespace App\Http\Controllers;

use App\Models\Movie;
use Illuminate\Http\Request;

class MovieController extends Controller
{
    public function index(Request $request)
    {
        $query = Movie::query();

        if($request->filled('title')){
            $query->where('title', 'like', '%' . $request->title . '%');
        }

        if ($request->filled('genre')) {
            $query->where('genre', 'like', '%' . $request->genre . '%');
        }

        if ($request->filled('director')) {
            $query->where('director', 'like', '%' . $request->director . '%');
        }

        $movies = $query->get();


        return inertia('Movies/Index', [
            'movies' => $movies,
            'filters' => request()->only('genre', 'title'),
        ]);
    }

    public function show(Movie $movie){
        $movie->load(['screenings', 'reviews.user']);

        return inertia('Movies/Show', [
            'movie' => $movie,
        ]);
    }
}
