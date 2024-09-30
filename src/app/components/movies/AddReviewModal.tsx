// // // src/app/components/movies/AddReviewModal.tsx
import { useEffect, useState } from 'react';
import { ImSpinner9 } from 'react-icons/im';

type AddReviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  review?: {
    id: number;
    movieId: number;
    reviewer: string;
    rating: number;
    comments: string;
    movieName: string;
  }; // Optional review prop for edit mode
  isEditMode?: boolean; // Flag to indicate if the modal is in edit mode
};

type Movie = {
  id: number;
  name: string;
};

function AddReviewModal({ isOpen, onClose, review, isEditMode = false }: AddReviewModalProps) {
  const [movieId, setMovieId] = useState<number | string>(review?.movieId ?? '');
  const [reviewer, setReviewer] = useState(review?.reviewer ?? '');
  const [rating, setRating] = useState(review?.rating ?? 0);
  const [comments, setComments] = useState(review?.comments ?? '');
  const [isLoading, setIsLoading] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]); // Dynamic movies list

  console.log("\n review : ", review);
  // Fetch movies from the API when modal opens
  useEffect(() => {
    if (isOpen && !isEditMode) { // Fetch movies only when adding new reviews
      const fetchMovies = async () => {
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
        }
      };
      fetchMovies();
    }
  }, [isOpen, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = isEditMode ? `/api/reviews` : '/api/reviews'; // No need to include id in URL for PUT
      const method = isEditMode ? 'PUT' : 'POST';
      
      const body = {
        movieId,
        reviewer,
        rating,
        comments,
        ...(isEditMode && { id: review?.id }), // Add id to body only in edit mode
      };
    
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    
      if (response.ok) {
        alert(isEditMode ? 'Review updated successfully!' : 'Review added successfully!');
        setMovieId('');
        setReviewer('');
        setRating(0);
        setComments('');
        onClose(); // Close modal after successful submission
      } else {
        const errorData = await response.json();
        console.error('Error submitting review:', errorData.error);
        alert(isEditMode ? 'Failed to update review' : 'Failed to add review');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-2xl font-bold mb-4 text-black">{isEditMode ? 'Edit review' : 'Add new review'}</h2>
            <button
              type="button"
              className="hover:bg-red-600 bg-red-500 text-white px-2 text-xl rounded cursor-pointer"
              onClick={onClose}
            >
              &#215;
            </button>
          </div>

          <div className="mb-4">
            <label className={`block text-gray-900 mb-2 ${isEditMode ? 'hidden' : 'block'}`}>Movie</label>
            <select
              className={`w-full p-2 border border-gray-300 rounded text-black ${isEditMode ? 'hidden' : 'block bg-white'
                }`}
              value={movieId}
              onChange={(e) => setMovieId(Number(e.target.value))}
              required = {!isEditMode}
            >
              <option value="" disabled>Select a movie</option>
              {movies.map((movie) => (
                <option key={movie.id} value={movie.id}>
                  {movie.name}
                </option>
              ))}
            </select>            
          </div>

          {/* Reviewer input */}
          <div className="mb-4">
            <label className="block text-gray-900 mb-2">Reviewer</label>
            <input
              className="w-full p-2 border border-gray-300 rounded text-black"
              type="text"
              value={reviewer}
              onChange={(e) => setReviewer(e.target.value)}
              required
            />
          </div>

          {/* Rating input */}
          <div className="mb-4">
            <label className="block text-gray-900 mb-2">Rating</label>
            <input
              className="w-full p-2 border border-gray-300 rounded text-black"
              type="number"
              value={rating}
              min="0"
              max="10"
              onChange={(e) => setRating(Number(e.target.value))}
              required
            />
          </div>

          {/* Comments input */}
          <div className="mb-4">
            <label className="block text-gray-900 mb-2">Comments</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded text-black"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              required
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="bg-indigo-500 text-white w-full p-2 rounded hover:bg-indigo-600"
          >
            {isLoading ? <ImSpinner9 className="animate-spin w-6 h-6 mx-auto" /> : isEditMode ? 'Update' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddReviewModal;





