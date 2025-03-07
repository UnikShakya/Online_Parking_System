// import { createContext, useContext, useState } from "react";

// // Create Context
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

// // Custom Hook to use Context
// export const useParking = () => useContext(ParkingContext);
