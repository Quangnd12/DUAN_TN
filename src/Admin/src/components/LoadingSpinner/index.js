import React from 'react';
import { RingLoader } from 'react-spinners';

const LoadingSpinner = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(5px)',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backdropFilter: 'blur(5px)', 
          padding: '20px', 
        }}
      >
        <RingLoader color="#3498db" size={50} />
      </div>
    </div>
  );
};

export default LoadingSpinner;
