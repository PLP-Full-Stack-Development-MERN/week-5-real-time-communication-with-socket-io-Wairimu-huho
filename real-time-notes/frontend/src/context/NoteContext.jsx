import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { socket } from '../socket';
import { useAuth } from './AuthContext';

const NoteContext = createContext();

export const useNotes = () => useContext(NoteContext);

export const NoteProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [roomUsers, setRoomUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [notifications, setNotifications] = useState([]);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  
  // Join a room
  const joinRoom = useCallback((roomId, username) => {
    if (roomId && username) {
      socket.emit('join_room', { roomId, username });
      setCurrentRoom(roomId);
      fetchNotes(roomId);
    }
  }, []);

  // Leave current room
  const leaveRoom = useCallback(() => {
    if (currentRoom) {
      socket.emit('leave_room', { roomId: currentRoom });
      setCurrentRoom(null);
      setNotes([]);
      setCurrentNote(null);
      setRoomUsers([]);
      navigate('/');
    }
  }, [currentRoom, navigate]);

  // Fetch notes for a room
  const fetchNotes = async (roomId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/notes/room/${roomId}`);
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Failed to load notes');
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new note
  // Create a new note
const createNote = async (noteData) => {
    try {
      // Debug what we're sending
      console.log("Creating note with data:", {
        ...noteData,
        roomId: currentRoom,
        createdBy: user?.username
      });
      
      // Check if required fields are present
      if (!currentRoom) {
        console.error("Missing roomId - currentRoom is", currentRoom);
        toast.error('Missing room ID. Please join a room first.');
        return null;
      }
      
      if (!user || !user.username) {
        console.error("Missing username - user is", user);
        toast.error('Missing username. Please log in first.');
        return null;
      }
      
      const response = await axios.post(`${API_URL}/notes`, {
        ...noteData,
        roomId: currentRoom,
        createdBy: user.username
      });
      
      setNotes(prev => [...prev, response.data]);
      setCurrentNote(response.data);
      toast.success('Note created successfully');
      
      return response.data;
    } catch (error) {
      console.error('Error creating note:', error);
      
      // Log more detailed error information
      if (error.response) {
        console.log('Server response data:', error.response.data);
        console.log('Server response status:', error.response.status);
        
        // Show more specific error message
        if (error.response.data && error.response.data.message) {
          toast.error(`Failed to create note: ${error.response.data.message}`);
        } else {
          toast.error('Failed to create note');
        }
      } else {
        toast.error('Failed to create note');
      }
      
      return null;
    }
  };

  // Update a note
  const updateNote = async (noteId, noteData) => {
    try {
      const response = await axios.put(`${API_URL}/notes/${noteId}`, noteData);
      
      setNotes(prev => 
        prev.map(note => note._id === noteId ? response.data : note)
      );
      
      if (currentNote && currentNote._id === noteId) {
        setCurrentNote(response.data);
      }
      
      // Emit socket event for real-time updates
      socket.emit('update_note', { 
        note: response.data, 
        roomId: currentRoom 
      });
      
      return response.data;
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error('Failed to update note');
      return null;
    }
  };

  // Delete a note
  const deleteNote = async (noteId) => {
    try {
      await axios.delete(`${API_URL}/notes/${noteId}`);
      
      setNotes(prev => prev.filter(note => note._id !== noteId));
      
      if (currentNote && currentNote._id === noteId) {
        setCurrentNote(null);
      }
      
      socket.emit('delete_note', { 
        noteId, 
        roomId: currentRoom 
      });
      
      toast.success('Note deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
      return false;
    }
  };

  // Emit typing indicator
  const emitTyping = useCallback(() => {
    if (currentRoom && user) {
      socket.emit('typing', { 
        roomId: currentRoom, 
        username: user.username 
      });
    }
  }, [currentRoom, user]);

  // Add notification
  const addNotification = useCallback((message) => {
    const notification = {
      id: Date.now(),
      message,
      timestamp: new Date().toLocaleTimeString()
    };
    setNotifications(prev => [notification, ...prev].slice(0, 10));
  }, []);

  // Handle socket events
  useEffect(() => {
    if (!socket) return;

    // Socket event handlers
    const onNoteCreated = (note) => {
      setNotes(prev => [...prev, note]);
      toast.info('New note added');
    };

    const onNoteUpdated = (updatedNote) => {
      setNotes(prev => 
        prev.map(note => 
          note._id === updatedNote._id ? updatedNote : note
        )
      );
      
      if (currentNote && currentNote._id === updatedNote._id) {
        setCurrentNote(updatedNote);
      }
    };

    const onNoteDeleted = ({ noteId }) => {
      setNotes(prev => prev.filter(note => note._id !== noteId));
      
      if (currentNote && currentNote._id === noteId) {
        setCurrentNote(null);
      }
      
      toast.info('A note was deleted');
    };

    const onUserJoined = (data) => {
      setRoomUsers(data.users);
      addNotification(data.message);
      toast.info(data.message);
    };

    const onUserLeft = (data) => {
      setRoomUsers(data.users);
      addNotification(data.message);
    };

    const onUserTyping = ({ username }) => {
      // Add user to typing users
      setTypingUsers(prev => {
        if (!prev.includes(username)) {
          return [...prev, username];
        }
        return prev;
      });
      
      // Remove user after 2 seconds
      setTimeout(() => {
        setTypingUsers(prev => prev.filter(user => user !== username));
      }, 2000);
    };

    // Register event listeners
    socket.on('new_note', onNoteCreated);
    socket.on('note_updated', onNoteUpdated);
    socket.on('note_deleted', onNoteDeleted);
    socket.on('user_joined', onUserJoined);
    socket.on('user_left', onUserLeft);
    socket.on('user_typing', onUserTyping);

    // Cleanup function
    return () => {
      socket.off('new_note', onNoteCreated);
      socket.off('note_updated', onNoteUpdated);
      socket.off('note_deleted', onNoteDeleted);
      socket.off('user_joined', onUserJoined);
      socket.off('user_left', onUserLeft);
      socket.off('user_typing', onUserTyping);
    };
  }, [addNotification, currentNote]);

  return (
    <NoteContext.Provider value={{
      notes,
      setNotes,
      currentNote,
      setCurrentNote,
      roomUsers,
      typingUsers,
      isLoading,
      currentRoom,
      notifications,
      joinRoom,
      leaveRoom,
      fetchNotes,
      createNote,
      updateNote,
      deleteNote,
      emitTyping
    }}>
      {children}
    </NoteContext.Provider>
  );
};