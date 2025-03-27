import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  PencilSquareIcon, 
  UserGroupIcon, 
  ArrowRightIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isGeneratingRoom, setIsGeneratingRoom] = useState(false);
  const { user, login } = useAuth();
  const navigate = useNavigate();
  
  // Pre-fill username if logged in
  useEffect(() => {
    if (user) {
      setUsername(user.username);
    }
  }, [user]);
  
  // Join a room
  const handleJoinRoom = (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast.error('Please enter a username');
      return;
    }
    
    if (!roomId.trim()) {
      toast.error('Please enter a room ID');
      return;
    }
    
    // Login if not already logged in
    if (!user) {
      login(username);
    }
    
    // Navigate to the room
    navigate(`/room/${roomId}`);
  };
  
  // Generate a random room ID
  const generateRoomId = () => {
    setIsGeneratingRoom(true);
    
    setTimeout(() => {
      const randomRoomId = Math.random().toString(36).substring(2, 11);
      setRoomId(randomRoomId);
      setIsGeneratingRoom(false);
    }, 700);
  };
  
  return (
    <div className="flex flex-col lg:flex-row min-h-[85vh]">
      {/* Left side - Hero section */}
      <div className="lg:w-1/2 flex flex-col justify-center p-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6">
          Real-Time <span className="text-indigo-600">Collaborative Notes</span>
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Create and edit notes in real-time with your team. See changes as they happen and collaborate seamlessly.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <FeatureCard 
            icon={<PencilSquareIcon className="w-8 h-8 text-indigo-500" />}
            title="Real-Time Editing"
            description="See changes as they happen in real-time."
          />
          
          <FeatureCard 
            icon={<UserGroupIcon className="w-8 h-8 text-indigo-500" />}
            title="Room-Based Collaboration"
            description="Join specific rooms for different projects."
          />
          
          <FeatureCard 
            icon={<LightBulbIcon className="w-8 h-8 text-indigo-500" />}
            title="User Presence"
            description="See who's online and who's typing."
          />
          
          <FeatureCard 
            icon={<ArrowRightIcon className="w-8 h-8 text-indigo-500" />}
            title="Simple to Use"
            description="No account required, just enter a username."
          />
        </div>
      </div>
      
      {/* Right side - Join form */}
      <div className="lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
              Join a Collaborative Room
            </h2>
            
            <form onSubmit={handleJoinRoom}>
              <div className="mb-6">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="username"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Room ID
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    id="roomId"
                    className="w-full px-4 py-3 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter room ID"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="px-4 py-3 bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-r-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none transition-colors"
                    onClick={generateRoomId}
                    disabled={isGeneratingRoom}
                  >
                    {isGeneratingRoom ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </span>
                    ) : (
                      "Generate"
                    )}
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Create a new room or join an existing one with the same ID.
                </p>
              </div>
              
              <button
                type="submit"
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Join Room
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Feature card component
const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <div className="mb-3">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
};

export default Home;