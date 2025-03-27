import { useNotes } from '../../context/NoteContext';
import { TrashIcon } from '@heroicons/react/24/outline';
import moment from 'moment';
import { useState } from 'react';

const NotesList = () => {
  const { notes, currentNote, setCurrentNote, deleteNote } = useNotes();
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);
  
  // Handle note selection
  const handleSelectNote = (note) => {
    setCurrentNote(note);
  };
  
  // Handle note deletion
  const handleDeleteNote = async (e, noteId) => {
    e.stopPropagation();
    
    // Show confirmation dialog
    setShowConfirmDelete(noteId);
  };
  
  // Confirm note deletion
  const confirmDelete = async (noteId) => {
    await deleteNote(noteId);
    setShowConfirmDelete(null);
  };
  
  // Cancel note deletion
  const cancelDelete = () => {
    setShowConfirmDelete(null);
  };
  
  // Format preview text
  const formatPreview = (content) => {
    if (!content) return 'No content';
    return content.length > 100 ? content.substring(0, 100) + '...' : content;
  };
  
  // Format date
  const formatDate = (dateString) => {
    return moment(dateString).format('MMM D, YYYY');
  };
  
  if (notes.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500 dark:text-gray-400">
          No notes yet. Create your first note to get started.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Notes
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => (
          <div
            key={note._id}
            className={`
              rounded-lg border p-4 cursor-pointer transition-all
              ${
                currentNote && currentNote._id === note._id
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }
            `}
            onClick={() => handleSelectNote(note)}
          >
            {/* Note header */}
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-gray-800 dark:text-white truncate">
                {note.title}
              </h3>
              
              {/* Delete button */}
              <button
                onClick={(e) => handleDeleteNote(e, note._id)}
                className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 ml-2"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
            
            {/* Note preview */}
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
              {formatPreview(note.content)}
            </p>
            
            {/* Note footer */}
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
              <span>By {note.createdBy}</span>
              <span>{formatDate(note.updatedAt)}</span>
            </div>
            
            {/* Delete confirmation */}
            {showConfirmDelete === note._id && (
              <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 flex items-center justify-center rounded-lg z-10">
                <div className="text-center p-4">
                  <p className="text-sm text-gray-800 dark:text-white mb-3">
                    Are you sure you want to delete this note?
                  </p>
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => confirmDelete(note._id)}
                      className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                    <button
                      onClick={cancelDelete}
                      className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white text-sm rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesList;