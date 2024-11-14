import React from 'react';
import { RingLoader } from 'react-spinners';


const LoadingSpinner = ({ isLoading }) => {
    if (!isLoading) return null;

    return (
        <div className="" style={{
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            zIndex: 9999
          }}>
            <RingLoader color="#3498db" size={50} />
        </div>
    );
};


export default LoadingSpinner;
