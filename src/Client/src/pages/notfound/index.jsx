import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900 text-white">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-xl mb-8">The page you are looking for doesn't exist.</p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-sky-500 text-white rounded-md shadow-md hover:bg-sky-600 transition duration-300"
      >
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound;