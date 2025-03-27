import { useState } from 'react';
import { useNotes } from '../../context/NoteContext';
import { Bars3Icon, ShareIcon, CheckIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const RoomHeader = ({ roomId, toggleSidebar }) => {
  const { roomUsers } = useNotes();
  const [isCopied, setIsCopied] = useState(false);
  
  // Share room link
  const shareRoom = () => {
    const roomUrl = `${window.location.origin}/room/${roomId}`;
    
    navigator.clipboard.writeText(roomUrl)
      .then(() => {
        setIsCopied(true);
        toast.success('Room link copied to clipboard!');
        
        // Reset copied state after 2 seconds
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch(() => {
        toast.error('Failed to copy link');
      });
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* Mobile menu button */}
          <button
            onClick={toggleSidebar}
            className="mr-4 md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          
          <div>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
              Room: <span className="ml-2 text-indigo-600 dark:text-indigo-400">{roomId}</span>
            </h1>
            
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {roomUsers.length} {roomUsers.length === 1 ? 'person' : 'people'} in this room
            </p>
          </div>
        </div>
        
        {/* Share button */}
        <button
          onClick={shareRoom}
          className="flex items-center px-3 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
        >
          {isCopied ? (
            <>
              <CheckIcon className="h-5 w-5 mr-1" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <ShareIcon className="h-5 w-5 mr-1" />
              <span>Share Room</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default RoomHeader;