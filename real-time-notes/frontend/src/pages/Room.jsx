import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotes } from '../context/NoteContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

// Components
import Sidebar from '../components/room/Sidebar';
import NoteEditor from '../components/room/NoteEditor';
import NotesList from '../components/room/NotesList';
import RoomHeader from '../components/room/RoomHeader';
import UserTypingIndicator from '../components/room/UserTypingIndicator';
import LoadingScreen from '../components/ui/LoadingScreen';

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    joinRoom, 
    currentRoom,
    isLoading, 
    notes, 
    currentNote, 
    setCurrentNote,
    typingUsers 
  } = useNotes();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      toast.error('Please login first');
      navigate('/');
      return;
    }
    
    // Join room
    if (roomId && user && !currentRoom) {
      joinRoom(roomId, user.username);
    }
    
    // Set first note as current if no note is selected
    if (notes.length > 0 && !currentNote) {
      setCurrentNote(notes[0]);
    }
  }, [roomId, user, currentRoom, joinRoom, navigate, notes, currentNote, setCurrentNote]);
  
  // Toggle sidebar (for mobile)
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Loading state
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  // Not logged in
  if (!user) {
    return null;
  }
  
  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <RoomHeader 
        roomId={roomId} 
        toggleSidebar={toggleSidebar} 
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - always visible on desktop, toggled on mobile */}
        <div className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 fixed md:relative z-30 md:z-auto w-72 h-[calc(100vh-120px)] md:h-auto
          transition-transform duration-300 ease-in-out
        `}>
          <Sidebar 
            onClose={() => setSidebarOpen(false)}
          />
        </div>
        
        {/* Backdrop for mobile sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        <div className="flex flex-col flex-1 md:ml-4 overflow-hidden">
          {/* Note list */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4 overflow-auto">
            <NotesList />
          </div>
          
          {/* Note editor */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md flex-1 flex flex-col overflow-hidden">
            {currentNote ? (
              <>
                <NoteEditor />
                
                {/* Typing indicator */}
                {typingUsers.length > 0 && (
                  <div className="px-6 py-2 bg-gray-100 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                    <UserTypingIndicator users={typingUsers} />
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-lg text-gray-500 dark:text-gray-400">
                    {notes.length > 0 
                      ? "Select a note to start editing" 
                      : "Create your first note to get started"
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;