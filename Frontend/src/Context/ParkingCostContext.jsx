// ParkingCostContext.js
import React, { createContext, useState, useContext } from "react";

const ParkingCostContext = createContext();

export const ParkingCostProvider = ({ children }) => {
  const [twoWheelerCost, setTwoWheelerCost] = useState(25);
  const [fourWheelerCost, setFourWheelerCost] = useState(45);

  return (
    <ParkingCostContext.Provider
      value={{
        twoWheelerCost,
        fourWheelerCost,
        setTwoWheelerCost,
        setFourWheelerCost
      }}
    >
      {children}
    </ParkingCostContext.Provider>
  );
};

export const useParkingCost = () => {
  const context = useContext(ParkingCostContext);
  if (!context) {
    throw new Error('useParkingCost must be used within a ParkingCostProvider');
  }
  return context;
};