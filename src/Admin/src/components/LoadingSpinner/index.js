// LoadingSpinner.js
import React from 'react';
import { RingLoader } from 'react-spinners';
import "../../assets/styles/loading.css"

const LoadingSpinner = ({ isLoading }) => {
    if (!isLoading) return null;

    return (
        <div className="loading-spinner">
            <RingLoader color="#3498db" size={50} />
        </div>
    );
};

export default LoadingSpinner;
