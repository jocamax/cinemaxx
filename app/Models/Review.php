<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = [
        'user_id', 'movie_id', 'screening_id', 'reservation_id', 'rating', 'comment',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function screening()
    {
        return $this->belongsTo(Screening::class);
    }

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }
}
