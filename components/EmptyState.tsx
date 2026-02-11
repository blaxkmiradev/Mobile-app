
import React from 'react';

const EmptyState: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-10 text-center opacity-40">
      <div className="mb-4 text-6xl">📝</div>
      <p className="m3-font text-lg font-medium">{message}</p>
      <p className="text-sm">Click the plus button to start writing.</p>
    </div>
  );
};

export default EmptyState;
