import { useState } from 'react';
import { useNotes } from '../../context/NoteContext';
import { useAuth } from '../../context/AuthContext';
import { PlusIcon, XMarkIcon, UsersIcon, BellIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import moment from 'moment';

const Sidebar = ({ onClose }) => {
  const { roomUsers, notifications, currentRoom, leaveRoom, createNote } = useNotes();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  
  // Create a new note
  const handleCreateNote = async (e) => {
    e.preventDefault();
    
    await createNote({
      title: noteTitle || 'Untitled Note',
      content: noteContent || ' ', // Providing at least a space to pass validation
    });
    
    // Reset form
    setNoteTitle('');
    setNoteContent('');
    setShowNoteForm(false);
  };
  
  return (
    <div className="h-full bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Rest of your sidebar code... */}
      
      {/* Footer with actions */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        {showNoteForm ? (
          <form onSubmit={handleCreateNote} className="space-y-3">
            <div>
              <input
                type="text"
                placeholder="Note title"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                minLength={3}
                required
              />
            </div>
            <div>
              <textarea
                placeholder="Note content"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                rows={3}
                required
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowNoteForm(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowNoteForm(true)}
            className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Note
          </button>
        )}
        
        <button
          onClick={leaveRoom}
          className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
          Leave Room
        </button>
      </div>
    </div>
  );
};

export default Sidebar;