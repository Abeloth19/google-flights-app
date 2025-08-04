import React from 'react';

const NotFoundComp: React.FC = () => {
  return (
    <div className="min-h-screen bg-theme-default text-theme-primary flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-theme-secondary">
          Page Not Found - will be properly implemented in Step 15
        </p>
      </div>
    </div>
  );
};

export default NotFoundComp;
