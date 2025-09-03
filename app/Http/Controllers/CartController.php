<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Screening;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $cart = session('cart', []);
        $ids  = array_keys($cart);

        $screenings = $ids
            ? Screening::with('movie')->whereIn('id', $ids)->get()
            : collect();

        $items = $screenings->map(function ($s) use ($cart) {
            $seats = (int) ($cart[$s->id]['seats'] ?? 1);
            return [
                'screening' => [
                    'id' => $s->id,
                    'datetime' => $s->datetime,
                    'price' => $s->price,
                    'movie' => ['title' => $s->movie->title],
                ],
                'seats' => $seats,
                'subtotal' => (float) $s->price * $seats,
            ];
        })->values();

        $total = $items->sum('subtotal');

        return Inertia::render('Cart/Index', [
            'items' => $items,
            'total' => number_format($total, 2, '.', ''),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'screening_id' => ['required', 'exists:screenings,id'],
            'seats' => ['nullable', 'integer', 'min:1', 'max:10'],
        ]);

        $screeningId = (int) $data['screening_id'];
        $seats = (int) ($data['seats'] ?? 1);

        $cart = session()->get('cart', []);
        $cart[$screeningId] = ['screening_id' => $screeningId, 'seats' => $seats];
        session()->put('cart', $cart);

        return redirect()->route('cart.index');
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'screening_id' => ['required', 'exists:screenings,id'],
            'seats' => ['required', 'integer', 'min:1', 'max:10'],
        ]);

        $cart = session('cart', []);
        if (! isset($cart[$data['screening_id']])) {
            return back(); // not in cart
        }

        $cart[$data['screening_id']]['seats'] = (int) $data['seats'];
        session()->put('cart', $cart);

        return back();
    }

    public function destroy(Request $request)
    {
        $data = $request->validate([
            'screening_id' => ['required', 'integer'],
        ]);

        $cart = session('cart', []);
        unset($cart[$data['screening_id']]);
        session()->put('cart', $cart);

        return back()->with('success', 'Removed from cart.');
    }

    public function confirm(Request $request)
    {
        $cart = session('cart', []);
        if (empty($cart)) return redirect()->route('cart.index');

        $userId = auth()->id();

        foreach ($cart as $item) {
            Reservation::updateOrCreate(
                ['user_id' => $userId, 'screening_id' => $item['screening_id']],
                ['seats' => (int) ($item['seats'] ?? 1), 'status' => 'rezervisano']
            );
        }

        session()->forget('cart');

        return redirect()->route('cart.index')->with('success', 'Reservations confirmed.');
    }

}
