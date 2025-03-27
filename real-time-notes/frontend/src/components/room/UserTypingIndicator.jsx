import { PencilIcon } from '@heroicons/react/24/outline';

const UserTypingIndicator = ({ users }) => {
  if (!users || users.length === 0) return null;
  
  // Format typing message
  const formatTypingMessage = () => {
    if (users.length === 1) {
      return `${users[0]} is typing...`;
    } else if (users.length === 2) {
      return `${users[0]} and ${users[1]} are typing...`;
    } else {
      return `${users[0]} and ${users.length - 1} others are typing...`;
    }
  };
  
  return (
    <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
      <PencilIcon className="h-4 w-4 mr-2 text-indigo-500" />
      
      <span>{formatTypingMessage()}</span>
      
      <span className="typing-animation ml-1">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </span>
      
      <style jsx>{`
        .typing-animation {
          display: inline-flex;
          align-items: center;
        }
        
        .dot {
          display: inline-block;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          margin-right: 3px;
          background: currentColor;
          animation: typing 1.4s infinite both;
        }
        
        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-4px);
          }
        }
      `}</style>
    </div>
  );
};

export default UserTypingIndicator;