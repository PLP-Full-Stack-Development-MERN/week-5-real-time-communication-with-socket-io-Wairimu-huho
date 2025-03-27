const LoadingScreen = ({ message = "Loading..." }) => {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">{message}</p>
      </div>
    );
  };
  
  export default LoadingScreen;