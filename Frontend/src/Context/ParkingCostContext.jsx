import React, { createContext, useContext, useState } from 'react';

const ParkingCostContext = createContext();

export const ParkingCostProvider = ({ children }) => {
  const [twoWheelerNum, setTwoWheelerNum] = useState(20); 
  const [fourWheelerNum, setFourWheelerNum] = useState(40); 

  return (
    <ParkingCostContext.Provider
    value={{
      twoWheelerNum,      
      fourWheelerNum,
      setTwoWheelerNum,   
      setFourWheelerNum,
    }}
    >
      {children}
    </ParkingCostContext.Provider>
  );
};

export const useParkingCost = () => useContext(ParkingCostContext);
