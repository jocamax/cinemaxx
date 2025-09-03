<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Movie;
use App\Models\Screening;
use App\Models\Reservation;
use App\Models\Review;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Movie::factory()
            ->count(10)
            ->has(Screening::factory()->count(3))
            ->create();

        User::factory()
            ->count(5)
            ->create()
            ->each(function ($user) {
                $screenings = Screening::inRandomOrder()->take(2)->get();

                foreach ($screenings as $screening) {
                    $reservation = $user->reservations()->create([
                        'screening_id' => $screening->id,
                        'status' => 'gledano',
                    ]);

                    $reservation->review()->create([
                        'user_id' => $user->id,
                        'screening_id' => $screening->id,
                        'rating' => rand(3, 5),
                        'comment' => 'Great movie!',
                    ]);
                }
            });
    }

}
