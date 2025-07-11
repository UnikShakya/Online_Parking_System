// import { createContext, useContext, useState } from "react";

// const ParkingContext = createContext();

// // Create Provider Component
// export const ParkingProvider = ({ children }) => {
//     const [selectedSpots, setSelectedSpots] = useState([]);
//     const [totalPrice, setTotalPrice] = useState(0);

//     return (
//         <ParkingContext.Provider value={{ selectedSpots, setSelectedSpots, totalPrice, setTotalPrice }}>
//             {children}
//         </ParkingContext.Provider>
//     );
// };

// export const useParking = () => useContext(ParkingContext);
