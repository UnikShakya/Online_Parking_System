import React from "react";
import { useLocation } from "react-router-dom";
import ParkingLot from "./ParkingLot";
import ParkingLot2 from "./ParkingLot2";
import ParkingLot3 from "./ParkingLot3";

const ParkingLotWrapper = () => {
  const { state } = useLocation();
  const parkingLotId = state?.parkingLotId || "1";

  const renderParkingLot = () => {
    switch (parkingLotId) {
      case "1":
        return <ParkingLot discountRate={0.2} />;
      case "2":
        return <ParkingLot2 />;
      case "3":
        return <ParkingLot3 />;
      default:
        return <ParkingLot />;
    }
  };

  return <div>{renderParkingLot()}</div>;
};

export default ParkingLotWrapper;
