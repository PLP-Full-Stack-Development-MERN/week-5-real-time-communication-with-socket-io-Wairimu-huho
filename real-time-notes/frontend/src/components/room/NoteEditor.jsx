import { useState, useEffect, useRef } from 'react';
import { useNotes } from '../../context/NoteContext';
import { useAuth } from '../../context/AuthContext';
import { debounce } from 'lodash';
import moment from 'moment';
import {
  PencilIcon,
  CheckIcon,
  ClockIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

const NoteEditor = () => {
  const { currentNote, updateNote, emitTyping } = useNotes();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const lastSavedRef = useRef(null);
  
  // Initialize editor with current note
  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content);
    }
  }, [currentNote]);
  
  // Debounced save function
  const debouncedSave = useRef(
    debounce(async (noteId, updates) => {
      setIsSaving(true);
      try {
        await updateNote(noteId, updates);
        lastSavedRef.current = new Date();
      } finally {
        setIsSaving(false);
      }
    }, 1000)
  ).current;
  
  // Handle title change
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    if (currentNote) {
      debouncedSave(currentNote._id, { ...currentNote, title: newTitle });
      emitTyping();
    }
  };
  
  // Handle content change
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    if (currentNote) {
      debouncedSave(currentNote._id, { ...currentNote, content: newContent });
      emitTyping();
    }
  };
  
  // Toggle edit mode
  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };
  
  // Format date
  const formatDate = (dateString) => {
    return moment(dateString).format('MMM D, YYYY h:mm A');
  };
  
  if (!currentNote) {
    return null;
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* Note header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div>
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="text-xl font-bold w-full bg-transparent border-b-2 border-indigo-500 dark:border-indigo-400 focus:outline-none text-gray-800 dark:text-white"
              placeholder="Note title"
              autoFocus
            />
          ) : (
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              {title}
            </h2>
          )}
          
          <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400 space-x-4">
            <div className="flex items-center">
              <ClockIcon className="h-3 w-3 mr-1" />
              <span>
                {isSaving ? 'Saving...' : `Last saved: ${formatDate(currentNote.updatedAt)}`}
              </span>
            </div>
            
            <div className="flex items-center">
              <UserIcon className="h-3 w-3 mr-1" />
              <span>Created by: {currentNote.createdBy}</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={toggleEditing}
          className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
        >
          {isEditing ? (
            <CheckIcon className="h-5 w-5" />
          ) : (
            <PencilIcon className="h-5 w-5" />
          )}
        </button>
      </div>
      
      {/* Note content */}
      <div className="flex-1 overflow-y-auto p-6">
        {isEditing ? (
          <textarea
            value={content}
            onChange={handleContentChange}
            className="w-full h-full min-h-[300px] bg-transparent resize-none focus:outline-none text-gray-800 dark:text-white"
            placeholder="Start writing your note here..."
          />
        ) : (
          <div className="prose dark:prose-invert max-w-none">
            {content ? (
              <div className="whitespace-pre-wrap">{content}</div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">
                This note is empty. Click the edit button to start writing.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteEditor;