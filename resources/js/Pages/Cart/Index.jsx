// resources/js/Pages/Cart/Index.jsx
import React from 'react';
import {router, usePage} from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import GuestLayout from "@/Layouts/GuestLayout.jsx";
import {notifications} from "@mantine/notifications";

export default function CartIndex({ items, total }) {
    const inc = (id, current) => router.post('/cart/update', { screening_id: id, seats: current + 1 }, { preserveScroll: true });
    const dec = (id, current) => router.post('/cart/update', { screening_id: id, seats: Math.max(1, current - 1) }, { preserveScroll: true });
    const changeSeats = (id, val) => {
        const n = parseInt(val || '1', 10);
        if (!Number.isNaN(n)) router.post('/cart/update', { screening_id: id, seats: Math.min(10, Math.max(1, n)) }, { preserveScroll: true });
    };
    const removeItem = (id) => router.post('/cart/remove', { screening_id: id }, { preserveScroll: true });
    const confirm = () => router.post('/cart/confirm');

    return (
        <AuthenticatedLayout>
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

            {items.length === 0 ? (
                <p className="text-gray-600">Your cart is empty.</p>
            ) : (
                <>
                    <div className="space-y-4">
                        {items.map(({ screening, seats, subtotal }) => (
                            <div key={screening.id} className="border rounded p-4 flex items-center justify-between">
                                <div>
                                    <div className="font-semibold">{screening.movie.title}</div>
                                    <div className="text-sm text-gray-600">
                                        {new Date(screening.datetime).toLocaleString()} • ${Number(screening.price).toFixed(2)} each
                                    </div>
                                    <div className="text-sm">Subtotal: ${Number(subtotal).toFixed(2)}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => dec(screening.id, seats)} className="px-2 py-1 border rounded">−</button>
                                    <input
                                        type="number"
                                        min={1}
                                        max={10}
                                        value={seats}
                                        onChange={(e) => changeSeats(screening.id, e.target.value)}
                                        className="w-16 border rounded p-1 text-center"
                                    />
                                    <button onClick={() => inc(screening.id, seats)} className="px-2 py-1 border rounded">+</button>
                                    <button onClick={() => removeItem(screening.id)} className="ml-3 text-red-600 hover:underline">Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                        <div className="text-lg font-semibold">Total: ${Number(total).toFixed(2)}</div>
                        <button onClick={() => {
                            notifications.show({
                                title: 'Reservation confirmed',
                                message: 'You can cancel your reservation anytime',
                            })
                            confirm()
                        }
                            } className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                            Confirm Reservations
                        </button>
                    </div>
                </>
            )}
        </div>
        </AuthenticatedLayout>
    );
}
//confirm
