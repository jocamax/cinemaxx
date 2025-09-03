import React, {useState} from 'react';
import { router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import GuestLayout from "@/Layouts/GuestLayout.jsx";

import { Button, Paper, Text, Title } from '@mantine/core';
import classes from './ArticleCardImage.module.css';


export default function Index({ movies, filters }) {
    const [title, setTitle] = useState(filters.title || '');
    const [genre, setGenre] = useState(filters.genre || '');

    const {auth} = usePage().props;
    console.log(auth)
    const Layout = auth?.user ? AuthenticatedLayout : GuestLayout;

    const handleSearch = () => {
        router.get('/movies', {
            title,
            genre,
        }, {
            preserveState: true,
        });
    };

    return (
        <Layout>
        <div className="p-4 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Movies</h1>

            <div className="mb-4 flex flex-col gap-2 md:flex-row">
                <div className="mb-4 flex flex-col gap-2 md:flex-row">
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border p-2 rounded w-full md:w-auto"
                    />
                    <input
                        type="text"
                        placeholder="Genre"
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                        className="border p-2 rounded w-full md:w-auto"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Search
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {movies.map((movie) => (
                    // <div key={movie.id} className="border rounded p-4 shadow">
                    //     <h2 className="text-xl font-semibold">{movie.title}</h2>
                    //     <p><strong>Genre:</strong> {movie.genre}</p>
                    //     <p><strong>Director:</strong> {movie.director}</p>
                    //     <p>{movie.description.slice(0, 100)}...</p>
                    //     <a href={`/movies/${movie.id}`} className="text-blue-500 mt-2 inline-block">View Details</a>
                    // </div>
                    <Paper shadow="md" p="xl" radius="md" className={classes.card}
                           style={{
                               backgroundImage: `url(${movie.image_url})`,
                           }}>
                        <div>
                            <p className={classes.category} >
                                {movie.genre}
                            </p>
                            <h1 className='bg-white p-2 mt-2 rounded-md text-3xl font-semibold opacity-85'>
                                {movie.title}
                            </h1>
                        </div>
                        <a href={`/movies/${movie.id}`} className=''>
                        <Button variant="white" color="dark">
                            See projections
                        </Button>
                        </a>
                    </Paper>
                ))}
            </div>

        </div>
        </Layout>
    );
}
