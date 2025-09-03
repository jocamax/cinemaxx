// resources/js/Pages/Reservations/Index.jsx
import React from 'react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";

const StatusTab = ({ label, value, active }) => (
    <button
        onClick={() => router.get('/reservations', { status: value }, { preserveState: true })}
        className={`px-3 py-1 rounded border ${active ? 'bg-blue-600 text-white' : ''}`}
    >
        {label}
    </button>
);

export default function ReservationsIndex({ status, reservations }) {
    const fmt = (d) => new Date(d).toLocaleString();

    const markWatched = (id) => router.post(`/reservations/${id}/watched`, {}, { preserveScroll: true });
    const markCancelled = (id) => router.post(`/reservations/${id}/cancel`, {}, { preserveScroll: true });

    const totalSum = reservations.reduce((acc, r) => acc + Number(r.total || 0), 0);

    return (
        <AuthenticatedLayout>
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">My Reservations</h1>

            <div className="flex gap-2 mb-6">
                <StatusTab label="Confirmed" value="rezervisano" active={status === 'rezervisano'} />
                <StatusTab label="Watched" value="gledano" active={status === 'gledano'} />
                <StatusTab label="Cancelled" value="otkazano" active={status === 'otkazano'} />
            </div>

            {reservations.length === 0 ? (
                <p className="text-gray-600">No reservations found for this status.</p>
            ) : (
                <>
                    <div className="space-y-4">
                        {reservations.map((r) => (
                            <div key={r.id} className="border rounded p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-semibold">{r.screening.movie.title}</div>
                                        <div className="text-sm text-gray-600">
                                            {fmt(r.screening.datetime)} • ${Number(r.screening.price).toFixed(2)} x {r.seats}
                                        </div>
                                        <div className="text-sm">Total: ${Number(r.total).toFixed(2)}</div>
                                        <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-gray-100 border">
                      {r.status}
                    </span>
                                    </div>

                                    {r.status === 'rezervisano' && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => markWatched(r.id)}
                                                className="px-3 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                                            >
                                                Mark as watched
                                            </button>
                                            <button
                                                onClick={() => markCancelled(r.id)}
                                                className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 text-right font-semibold">
                        Sum total: ${Number(totalSum).toFixed(2)}
                    </div>
                </>
            )}
        </div>
        </AuthenticatedLayout>
    );
}
