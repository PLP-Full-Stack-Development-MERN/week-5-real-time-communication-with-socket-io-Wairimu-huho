import { Link } from 'react-router-dom';
import { FolderOpenIcon } from '@heroicons/react/24/outline';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <FolderOpenIcon className="h-24 w-24 text-gray-400 mb-4" />
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
        Page Not Found
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
};

export default NotFound;