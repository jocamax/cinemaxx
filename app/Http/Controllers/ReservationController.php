<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReservationController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->get('status', 'rezervisano');

        $reservations = Reservation::with(['screening.movie'])
            ->where('user_id', auth()->id())
            ->when($status, fn($q) => $q->where('status', $status))
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($r) {
                return [
                    'id'        => $r->id,
                    'status'    => $r->status,
                    'seats'     => $r->seats ?? 1,
                    'created_at'=> $r->created_at,
                    'screening' => [
                        'id'       => $r->screening->id,
                        'datetime' => $r->screening->datetime,
                        'price'    => $r->screening->price,
                        'movie'    => [
                            'id'    => $r->screening->movie->id,
                            'title' => $r->screening->movie->title,
                        ],
                    ],
                    'total'     => (float) $r->screening->price * (int)($r->seats ?? 1),
                ];
            });

        return Inertia::render('Reservations/Index', [
            'status'       => $status,
            'reservations' => $reservations,
        ]);
    }
    public function markWatched(\App\Models\Reservation $reservation)
    {
        abort_unless($reservation->user_id === auth()->id(), 403);

        if ($reservation->status === 'rezervisano') {
            $reservation->update(['status' => 'gledano']);
        }

        return back()->with('success', 'Reservation marked as watched.');
    }

    public function markCancelled(\App\Models\Reservation $reservation)
    {
        abort_unless($reservation->user_id === auth()->id(), 403);

        if ($reservation->status === 'rezervisano') {
            $reservation->update(['status' => 'otkazano']);
        }

        return back()->with('success', 'Reservation cancelled.');
    }
}
