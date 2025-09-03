<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Movie extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'description', 'genre', 'duration', 'director', 'actors', 'release_date', 'image_url',
    ];

    protected $casts = [
        'actors' => 'array',
        'release_date' => 'date',
    ];

    public function screenings()
    {
        return $this->hasMany(Screening::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
