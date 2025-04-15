import React, { createContext, useContext, useState } from 'react';

const ParkingCostContext = createContext();

export const ParkingCostProvider = ({ children }) => {
  const [twoWheelerNum, setTwoWheelerNum] = useState(20); // Default: Rs.20
  const [fourWheelerNum, setFourWheelerNum] = useState(40); // Default: Rs.40

  return (
    <ParkingCostContext.Provider
    value={{
      twoWheelerNum,      // Pass these names
      fourWheelerNum,
      setTwoWheelerNum,   // Setters (if needed)
      setFourWheelerNum,
    }}
    >
      {children}
    </ParkingCostContext.Provider>
  );
};

export const useParkingCost = () => useContext(ParkingCostContext);
