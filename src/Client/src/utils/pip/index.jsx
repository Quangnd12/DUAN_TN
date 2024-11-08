import React, { createContext, useState, useContext } from 'react';

const PipContext = createContext();

export const PipProvider = ({ children }) => {
  const [isPipOpen, setIsPipOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Hàm để toggle trạng thái mở/đóng PIP
  const togglePip = () => setIsPipOpen(!isPipOpen);

  // Hàm để cập nhật vị trí cửa sổ PIP
  const updatePosition = (newPosition) => setPosition(newPosition);

  return (
    <PipContext.Provider value={{ isPipOpen, togglePip, position, updatePosition }}>
      {children}
    </PipContext.Provider>
  );
};

// Custom hook để sử dụng PipContext trong các thành phần khác
export const usePip = () => useContext(PipContext);
