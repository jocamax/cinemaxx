import React, { useState } from 'react';
import {router, usePage} from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import GuestLayout from "@/Layouts/GuestLayout.jsx";
import {Button} from "@mantine/core";

export default function Show({ movie }) {
    const [addingId, setAddingId] = useState(null);
    const {auth} = usePage().props;
    const Layout = auth?.user ? AuthenticatedLayout : GuestLayout;

    const fmt = (d) => new Date(d).toLocaleString('sr-RS', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });

    const addToCart = (screeningId) => {
        const fmt = (d) => new Date(d).toLocaleString();
        setAddingId(screeningId);
        router.post(route('cart.store'), {
            screening_id: screeningId,
            seats: 1,
        }, {
            onFinish: () => setAddingId(null),
        });
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-3xl font-bold">{movie.title}</h1>
                <p className="mt-2 text-gray-600">{movie.description}</p>

                <h2 className="mt-8 text-xl font-semibold">Screenings:</h2>
                <ul className="mt-2 space-y-2">
                    {movie.screenings.map(screening => (
                        <li key={screening.id}
                            className="border-b  p-2 py-4 flex items-center justify-between shadow-md">
                            <div className='flex flex-col'>
                                <div className='mb-2'>
                                    <h3 className='text-lg font-bold '>HALL 3 for {movie.title}</h3>
                                    <div className='font-semibold rounded-md text-lg mt-1 '>
                                        {screening.price} $
                                    </div>
                                </div>
                                <p>Date: <span className='ml-2 text-gray-600'>{fmt(screening.datetime)}</span></p>
                            </div>
                            <button
                                onClick={() => addToCart(screening.id)}
                                disabled={addingId === screening.id}
                                className="bg-blue-500 text-white text-sm px-4 py-1 rounded hover:bg-blue-700"
                            >
                                {addingId === screening.id ? 'Adding...' : 'Add to Cart'}
                            </button>
                        </li>
                    ))}
                </ul>

                <h2 className="mt-8 text-xl font-semibold">Reviews</h2>
                <div className='max-w-xl py-4'>
                    <label htmlFor="comment" className="block text-sm/6 font-medium text-gray-900">
                        Add your comment
                    </label>
                    <div className="mt-2">
                        <textarea
                            id="comment"
                            name="comment"
                            rows={2}
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            defaultValue={''}
                        />
                    </div>
                    <div className="flex justify-end mt-2">
                        <Button>Post</Button>
                    </div>
                </div>
                <ul className="mt-2 space-y-3">
                    {movie.reviews.map(review => (
                        <li key={review.id} className="bg-gray-100 p-4 rounded border-b-2">
                            <div className='flex gap-4 items-center mb-2'>
                                <div className="font-semibold">{review.user.name}</div>
                                <div className="text-sm text-gray-600">{review.rating}★</div>
                            </div>

                            <p>{review.comment}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </Layout>
    );
}
