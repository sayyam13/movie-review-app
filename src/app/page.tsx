// src/app/page.tsx
"use client"
import { useState } from 'react';
import MainContent from './components/movies/page';
import AddMovieModal from './components/movies/AddMovieModal';
import AddReviewModal from './components/movies/AddReviewModal';

export default function Home() {
  const [isMovieModalOpen, setIsMovieModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg p-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">MOVIECRITIC</div>
        <div className="flex space-x-4">
          <button
            onClick={() => setIsMovieModalOpen(true)}
            className="border-2 border-zinc-300 bg-white font-semibold text-indigo-500 px-4 py-2 rounded hover:bg-indigo-500 hover:text-white transition"
          >
            Add new movie
          </button>
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="border-2 border-zinc-300 bg-white font-semibold text-indigo-500  hover:bg-indigo-500 hover:text-white px-4 py-2 rounded transition"
          >
            Add new review
          </button>
        </div>
      </nav>

      <main className="p-8">
        <MainContent />
      </main>

      {/* Modals */}
      <AddMovieModal isOpen={isMovieModalOpen} onClose={() => setIsMovieModalOpen(false)} />
      <AddReviewModal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} />
    </div>
  );
}


