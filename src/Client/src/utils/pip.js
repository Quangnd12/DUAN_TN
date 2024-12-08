import React, { createContext, useState, useCallback, useEffect, useContext } from 'react';

const PipContext = createContext();

export const PipProvider = ({ children }) => {
  const [isPipOpen, setIsPipOpen] = useState(false);
  const [pipWindow, setPipWindow] = useState(null);

  const togglePip = useCallback(async (videoElement) => {
    try {
      if (!document.pictureInPictureEnabled) {
        console.error('Picture-in-Picture is not supported');
        return;
      }

      if (!isPipOpen) {
        const pipWindow = await videoElement.requestPictureInPicture();
        setPipWindow(pipWindow);
        setIsPipOpen(true);
      } else {
        await document.exitPictureInPicture();
        setPipWindow(null);
        setIsPipOpen(false);
      }
    } catch (error) {
      console.error('Failed to toggle Picture-in-Picture:', error);
    }
  }, [isPipOpen]);

  useEffect(() => {
    const handlePipClose = () => {
      setIsPipOpen(false);
      setPipWindow(null);
    };

    document.addEventListener('leavepictureinpicture', handlePipClose);
    return () => {
      document.removeEventListener('leavepictureinpicture', handlePipClose);
    };
  }, []);

  const value = {
    isPipOpen,
    togglePip,
    pipWindow
  };

  return (
    <PipContext.Provider value={value}>
      {children}
    </PipContext.Provider>
  );
};

export const usePip = () => {
  const context = useContext(PipContext);
  if (!context) {
    throw new Error('usePip must be used within a PipProvider');
  }
  return context;
}; 