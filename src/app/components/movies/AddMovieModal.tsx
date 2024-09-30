// src/app/components/movies/AddMovieModal.tsx
import { useState, useEffect } from 'react';
import { ImSpinner9 } from 'react-icons/im';

type AddMovieModalProps = {
  isOpen: boolean;
  onClose: () => void;
  movie?: { id: number; name: string; releaseDate: string } | null; // Optional movie for editing taking all the props
};

export default function AddMovieModal({ isOpen, onClose, movie }: AddMovieModalProps) {
  const [movieName, setMovieName] = useState(movie?.name || '');
  const [releaseDate, setReleaseDate] = useState(movie?.releaseDate || '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (movie) {
      console.log(movie);
      setMovieName(movie.name);
      setReleaseDate(new Date(movie.releaseDate).toISOString().split('T')[0]); // here by splitting we can display the existing date to user for editing/modifying.
    }
  }, [movie]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const method = movie ? 'PUT' : 'POST'; // Use PUT for editing, POST for creating
      const endpoint = movie ? `/api/movies` : '/api/movies'; // Use movie ID if editing

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: movie?.id, // Include ID for PUT
          name: movieName,
          releaseDate,
        }),
      });

      if (!response.ok) {
        alert(`Failed to ${movie ? 'update' : 'create'} movie`);
      }

      const result = await response.json();
      console.log(`${movie ? 'Updated' : 'Created'} movie:`, result.movie);
      alert(`${movie ? 'Movie updated' : 'Movie created'} successfully`);
      setMovieName('');
      setReleaseDate('');
      onClose();
    } catch (err) {
      console.error(err);
      console.log(`Failed to ${movie ? 'update' : 'create'} movie`);
     // setError(`Failed to ${movie ? 'update' : 'create'} movie`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <form className='cursor-pointer' onSubmit={handleSubmit}>
          <div className='flex justify-between items-start mb-2'>
            <h2 className="text-2xl font-bold mb-4 text-black">
              {movie ? 'Edit movie' : 'Add new movie'}
            </h2>
            <button
              type="button"
              className="hover:bg-red-600 bg-red-500 text-white px-2 text-xl rounded cursor-pointer"
              onClick={onClose}
            >
              &#215;
            </button>
          </div>
          <div className="mb-4 r">
            <label className="block text-gray-900 mb-2">Movie name</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded text-black"
              value={movieName}
              onChange={(e) => setMovieName(e.target.value)}
              placeholder="Enter movie name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-900 mb-2">Release date</label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded text-black"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              required
            />
          </div>
          <div className='text-right'>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:bg-opacity-60 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? <ImSpinner9 className="w-4 h-4 animate-spin" /> : movie ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
