import React from 'react';

type DeleteMovieModalProps = {
  isOpen: boolean;
  movieName: string;
  onClose: () => void;
  onConfirmDelete: () => void;
};

function DeleteMovieModal({
  isOpen,
  movieName,
  onClose,
  onConfirmDelete,
}: DeleteMovieModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-zinc-200 px-6 py-6 rounded shadow-lg max-w-md w-full h-xl">
        <h2 className="text-2xl font-bold text-red-700 mb-4">Delete movie?</h2>
        <p className="text-black mb-8">
          This will delete <strong>{movieName}</strong> permanently!
        </p>
        <div className="flex justify-end space-x-4">
          <button
            className="text-neutral-800 font-semibold px-4 py-2 rounded hover:bg-zinc-500 hover:text-white"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800"
            onClick={onConfirmDelete}
          >
            Yes, delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteMovieModal;