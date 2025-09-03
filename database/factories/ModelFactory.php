<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Movie;
use App\Models\Screening;
use App\Models\Reservation;
use App\Models\Review;

use Illuminate\Support\Carbon;

/**
 * Factory for User
 */
class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition()
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
            'remember_token' => Str::random(10),
            'phone' => $this->faker->phoneNumber(),
            'address' => $this->faker->address(),
            'favorite_genres' => json_encode($this->faker->randomElements(['comedy', 'drama', 'action', 'thriller'], 2)),
        ];
    }
}

/**
 * Factory for Movie
 */
class MovieFactory extends Factory
{
    protected $model = Movie::class;

    public function definition()
    {
        return [
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(),
            'genre' => $this->faker->randomElement(['comedy', 'drama', 'action', 'thriller']),
            'duration' => $this->faker->numberBetween(80, 180),
            'director' => $this->faker->name(),
            'actors' => json_encode([
                $this->faker->name(),
                $this->faker->name(),
                $this->faker->name(),
            ]),
            'release_date' => $this->faker->dateTimeBetween('-2 years', 'now'),
        ];
    }
}

/**
 * Factory for Screening
 */
class ScreeningFactory extends Factory
{
    protected $model = Screening::class;

    public function definition()
    {
        return [
            'movie_id' => Movie::factory(),
            'datetime' => Carbon::now()->addDays(rand(1, 30))->setTime(rand(10, 20), 0),
            'price' => $this->faker->randomFloat(2, 5, 15),
        ];
    }
}

/**
 * Factory for Reservation
 */
class ReservationFactory extends Factory
{
    protected $model = Reservation::class;

    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'screening_id' => Screening::factory(),
            'status' => $this->faker->randomElement(['rezervisano', 'gledano', 'otkazano']),
        ];
    }
}

/**
 * Factory for Review
 */
class ReviewFactory extends Factory
{
    protected $model = Review::class;

    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'screening_id' => Screening::factory(),
            'reservation_id' => null, // manually assign for real relations
            'rating' => $this->faker->numberBetween(1, 5),
            'comment' => $this->faker->optional()->sentence(),
        ];
    }
}
