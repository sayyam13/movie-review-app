"use client"
// src/app/components/movies/page.tsx
import React, { useEffect, useState } from 'react';
import { ImSpinner9 } from 'react-icons/im';
import moment from 'moment';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import AddMovieModal from './AddMovieModal';
import DeleteMovieModal from './DeleteMovieModal';
import MovieReviewsModal from './MovieReviewsModal';

type Movie = {
  id: number;
  name: string;
  releaseDate: string;
  averageRating: number | null;
};

export default function MainContent() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false); // State for delete modal
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null); // Track selected movie for editing/deleting
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState<boolean>(false); // State for reviews modal
  const [selectedMovieForReviews, setSelectedMovieForReviews] = useState<Movie | null>(null); // Track selected movie for reviews
  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/movies');
        if (response.ok) {
          const data = await response.json();
          setMovies(data);
        } else {
          console.error('Failed to fetch movies');
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Function to open edit modal with selected movie data
  const handleEdit = (movie: Movie) => {
    setSelectedMovie(movie); // Set the selected movie for editing
    setIsEditModalOpen(true); // Open the modal for editing purpose
  };

  // Function to open delete modal with selected movie
  const handleDelete = (movie: Movie) => {
    setSelectedMovie(movie); // Set the selected movie for deleting
    setIsDeleteModalOpen(true); // Open the delete confirmation modal
  };

  // Function to open reviews modal with selected movie data
  const handleShowReviews = (movie: Movie) => {
    setSelectedMovieForReviews(movie); // Set the selected movie for reviews
    setIsReviewsModalOpen(true); // Open the modal for viewing reviews
  };

  // Function to confirm movie deletion
  const confirmDelete = async () => {
    if (!selectedMovie) return;

    try {
      const response = await fetch('/api/movies', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: selectedMovie.id }),
      });

      if (response.ok) {
        setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== selectedMovie.id));
        setIsDeleteModalOpen(false); // Close the modal
        alert("movies deleted successfully!");
      } else {
        alert("Failed to delete movie");
        console.error('Failed to delete movie');
      }
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-30 flex items-center justify-center bg-slate-200 bg-opacity-50 z-50 w-[96%]  text-black">
        <div className="flex flex-col items-center justify-center min-h-[650px]">
          <ImSpinner9 className='w-10 h-10 animate-spin'/>
          <span className="mt-2 text-sm font-semibold text-black">Loading...</span>
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">No movies yet</h1>
          <p className="text-lg text-gray-500">Let&apos;s add some movies!</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="sm:text-4xl text-2xl font-bold text-gray-800 mb-6 text-center ">
        The best movie reviews site!
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onEdit={() => handleEdit(movie)} // Pass the edit handler
            onDelete={() => handleDelete(movie)} // Pass the delete handler
            onShowReviews={() => handleShowReviews(movie)} // Pass the show reviews handler
          />
        ))}
      </div>

      {isEditModalOpen && selectedMovie && (
        <AddMovieModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          movie={selectedMovie} // Pass selected movie to modal as props
        />
      )}

      {isDeleteModalOpen && selectedMovie && (
        <DeleteMovieModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          movieName={selectedMovie.name} // Pass movie name to modal
          onConfirmDelete={confirmDelete} // Pass delete confirmation handler
        />
      )}

      {isReviewsModalOpen && selectedMovieForReviews && (
        <MovieReviewsModal
          isOpen={isReviewsModalOpen}
          onClose={() => setIsReviewsModalOpen(false)}
          movieId={selectedMovieForReviews.id} // Pass the selected movie ID to the modal
          movieName={selectedMovieForReviews.name} // Pass the movie name to the modal
          averageRating={selectedMovieForReviews.averageRating} // Pass the average rating to the modal
        />
      )}
    </div>
  );
}

type MovieCardProps = {
  movie: Movie;
  onEdit: () => void; // Callback function to handle edit
  onDelete: () => void; // Callback function to handle delete
  onShowReviews : () => void;
};

function MovieCard({ movie, onEdit, onDelete, onShowReviews }: MovieCardProps) {

  return (
    <div className="bg-violet-300 shadow-lg rounded-sm px-8 py-10 text-black cursor-pointer hover:border-2 hover:border-violet-400">
      <h2 className="text-xl font-semibold mb-3">{movie.name}</h2>
      <p className="text-neutral-800 mb-3 italic ">Released {moment(movie.releaseDate).format('DD MMMM, YYYY')}</p>
      <p className="text-black font-semibold">Rating: {movie.averageRating?.toFixed(1) ?? "N/A"} / 10</p>
      <div className='flex justify-end'>
        <button className='rounded-lg p-2 hover:bg-zinc-300' onClick={onEdit}>
          <FaEdit className='w-4 h-4 text-zinc-700' />
        </button>
        <button className='rounded-lg p-2 hover:bg-zinc-300' onClick={onDelete}>
          <MdDelete className='w-4 h-4 text-zinc-700' />
        </button>
        <button className='rounded-lg p-2 border-2 border-indigo-500 hover:bg-indigo-500 hover:text-white hover:font-semibold' onClick={onShowReviews}>
          Show Reviews
        </button>
      </div>
    </div>
  );
}





