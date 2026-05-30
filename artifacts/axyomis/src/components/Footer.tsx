import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <p className="text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Axyomis. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
