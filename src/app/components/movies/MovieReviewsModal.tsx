// // src/app/components/movies/MovieReviewsModal.tsx
import React, { useEffect, useState } from 'react';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import AddReviewModal from './AddReviewModal'; // Import AddReviewModal

type Review = {
  movieId: number;
  movieName: string;
  comments: string;
  id: number;
  reviewer: string;
  rating: number;
};

type MovieReviewsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  movieId: number;
  movieName: string;
  averageRating: number | null;
};

const MovieReviewsModal: React.FC<MovieReviewsModalProps> = ({ isOpen, onClose, movieId, movieName, averageRating }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null); // State to store the selected review

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/reviews?movieId=${movieId}`);
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        } else {
          console.error('Failed to fetch reviews');
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchReviews();
    }
  }, [isOpen, movieId]);

  const handleEditClick = (review: Review) => {
    setSelectedReview(review); // Set the selected review to be edited
    setIsEditModalOpen(true); // Open the AddReviewModal in edit mode
  };

  const handleDeleteClick = async (review: Review) => {
    try {
      const response = await fetch(`/api/reviews`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: review.id }),
      });

      if (response.ok) {
        alert('Review deleted successfully!');
        // Remove the deleted review from the local state
        setReviews(reviews.filter((r) => r.id !== review.id));
      } else {
        const errorData = await response.json();
        console.error('Error deleting review:', errorData.error);
        alert('Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review');
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/2">
        <div className="flex justify-between items-center mb-4 text-black">
          <h2 className="text-xl font-bold mb-4">{movieName}</h2>
          <span className="text-xl font-semibold text-indigo-500">{averageRating?.toFixed(1) ?? "N/A"}</span>
        </div>

        {isLoading ? (
          <p className="text-black px-4 py-10 text-center">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-black px-4 py-10 text-center">No reviews yet for this movie.</p>
        ) : (
          <ul className="text-black">
            {reviews.map((review) => (
              <li key={review.id} className="border-2 border-zinc-300 rounded-sm mb-5 p-4 cursor-pointer">
                <div className="flex justify-between mb-4">
                  <p>{review.comments}</p>
                  <p className="text-indigo-500">{review.rating} / 10</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-md italic">By {review.reviewer}</p>
                  <div className="flex justify-between">
                    <button className="rounded-lg p-2 hover:bg-zinc-300" onClick={() => handleEditClick(review)}>
                      <FaEdit className="w-4 h-4 text-zinc-700" />
                    </button>
                    <button className="rounded-lg p-2 hover:bg-zinc-300"onClick={() => handleDeleteClick(review)}>
                      <MdDelete className="w-4 h-4 text-zinc-700" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="flex justify-end">
          <button onClick={onClose} className="mt-4 bg-indigo-500 text-white px-6 py-2 rounded hover:bg-indigo-600">Close</button>
        </div>
      </div>

      {/* AddReviewModal in edit mode */}
      {selectedReview && (
        <AddReviewModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          review={selectedReview} // Pass the selected review for editing
          isEditMode={true} // Indicate that it's edit mode
        />
      )}
    </div>
  );
};

export default MovieReviewsModal;
