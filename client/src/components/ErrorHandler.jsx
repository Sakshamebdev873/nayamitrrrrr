import React from 'react';
import { Link } from 'react-router-dom';
import { BiErrorCircle } from 'react-icons/bi';

export function ErrorHandler() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 px-4">
      <div className="text-center">
        <BiErrorCircle className="text-6xl text-red-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-800 mb-2">404 - Page Not Found</h1>
        <p className="text-gray-600 mb-6">The page you're looking for doesn't exist or has been moved.</p>
        <Link
          to="/"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
