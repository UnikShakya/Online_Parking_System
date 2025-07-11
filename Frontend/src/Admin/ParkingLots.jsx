import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ParkingLots = () => {
  const { locationId } = useParams();
  const [parkingLots, setParkingLots] = useState([]);
  const [bookedSpots, setBookedSpots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(locationId || "Patan");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let parkingResponse, bookedResponse;

        if (currentLocation === "Patan") {
          parkingResponse = await axios.get("http://localhost:3000/api/parking");
          bookedResponse = await axios.get("http://localhost:3000/api/parking/booked");
        } else if (currentLocation === "Bouddha") {
          parkingResponse = await axios.get("http://localhost:3000/api/parking/location2");
          bookedResponse = await axios.get("http://localhost:3000/api/parking/booked-location2");
        } else if (currentLocation === "Bhaktapur") {
          parkingResponse = await axios.get("http://localhost:3000/api/parking/location3");
          bookedResponse = await axios.get("http://localhost:3000/api/parking/booked-location3");
        }

        const filteredParkingLots = parkingResponse.data.filter(
          spot => spot.location === currentLocation
        );
        setParkingLots(filteredParkingLots);

        const bookedData = Array.isArray(bookedResponse.data) ? bookedResponse.data : [];
        const bookedSpotNumbers = bookedData
          .map(spot => spot.selectedSpots)
          .filter(Boolean)
          .flat();
        setBookedSpots(bookedSpotNumbers);

      } catch (err) {
        console.error("Error fetching data:", err);
        setBookedSpots([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentLocation]);

  const ParkingSpot = ({ spot, bookedSpots, is4Wheeler = false }) => {
    const isBooked = spot.isBooked || bookedSpots.includes(spot.selectedSpots);

    return (
      <div
        className={`flex flex-col justify-center items-center rounded-md ${
          isBooked ? "bg-red-500 cursor-not-allowed" : "bg-blue-400 cursor-default"
        } ${is4Wheeler ? "w-20 h-32 m-1" : "w-12 h-8 m-1"} relative`}
      >
        <span className={`font-bold ${is4Wheeler ? "text-sm" : "text-xs"} ${isBooked ? "text-white" : "text-gray-800"}`}>
          {spot.selectedSpots}
        </span>
        {isBooked && (
          <div className="flex items-center justify-center">
            <div className="w-full h-0.5 bg-white"></div>
          </div>
        )}
        {is4Wheeler && (
          <div className="absolute bottom-1 w-4/5 h-1 bg-gray-600 rounded-full"></div>
        )}
      </div>
    );
  };

  const render2WheelerParking = () => {
    const twoWheelerSpots = parkingLots.filter(spot => {
      const spotId = String(spot.selectedSpots || '');
      return spotId && !spotId.startsWith("R");
    });

    if (twoWheelerSpots.length === 0) {
      return <div className="text-center py-4">No 2-wheeler spots available</div>;
    }

    const rows = [];
    for (let i = 0; i < twoWheelerSpots.length; i += 10) {
      const rowSpots = twoWheelerSpots.slice(i, i + 10);
      rows.push(
        <div key={`row-${i}`} className="flex justify-center gap-4 mb-2">
          <div className="flex space-x-1">
            {rowSpots.map((spot) => (
              <ParkingSpot
                key={spot.selectedSpots}
                spot={spot}
                bookedSpots={bookedSpots}
                is4Wheeler={false}
              />
            ))}
          </div>
        </div>
      );
    }
    return rows;
  };

  const render4WheelerParking = () => {
    const fourWheelerSpots = parkingLots.filter(spot => {
      const spotId = String(spot.selectedSpots || '');
      return spotId && spotId.startsWith("R");
    });

    if (fourWheelerSpots.length === 0) {
      return <div className="text-center py-4">No 4-wheeler spots available</div>;
    }

    return (
      <div className="flex justify-center">
        <div className="grid grid-cols-6 gap-4">
          {fourWheelerSpots.map((spot) => (
            <ParkingSpot
              key={spot.selectedSpots}
              spot={spot}
              bookedSpots={bookedSpots}
              is4Wheeler={true}
            />
          ))}
        </div>
      </div>
    );
  };

  const handleLocationChange = (location) => {
    setCurrentLocation(location);
  };

  return (
    <div className="relative p-5 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold text-center text-gray-800 my-8">
        Admin Parking View - {currentLocation}
      </h1>

      <div className="flex space-x-4 mb-8">
        {["Patan", "Bouddha", "Bhaktapur"].map(loc => (
          <button
            key={loc}
            onClick={() => handleLocationChange(loc)}
            className={`px-4 py-2 rounded-lg ${
              currentLocation === loc
                ? "bg-gradient-to-r from-gradientStart to-gradientEnd text-white"
                : "bg-white text-gray-800"
            }`}
          >
            {loc}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-lg text-gray-700">Loading parking data...</p>
        </div>
      ) : (
        <>
          <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="bg-gray-500 h-12 mb-6 flex items-center justify-center">
              <span className="text-white font-bold text-lg">ENTRY</span>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 text-center text-gray-700 bg-blue-100 py-2 rounded">
                2-Wheeler Parking
              </h3>
              <div className="parking-rows">{render2WheelerParking()}</div>
            </div>

            <div className="border-t-4 border-dashed border-gray-300 my-6"></div>

            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4 text-center text-gray-700 bg-green-100 py-2 rounded">
                4-Wheeler Parking
              </h3>
              <div className="parking-rows">{render4WheelerParking()}</div>
            </div>

            <div className="bg-gray-500 h-12 mt-6 flex items-center justify-center">
              <span className="text-white font-bold text-lg">EXIT</span>
            </div>
          </div>

          <div className="flex justify-center mt-4 space-x-8 mb-8 bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-green-400 rounded mr-2"></div>
              <span className="text-gray-700">Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-red-500 rounded mr-2"></div>
              <span className="text-gray-700">Booked</span>
            </div>
          </div>

          <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold mb-4 text-center text-gray-700">
              Parking Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800">2-Wheeler</h4>
                <p>Total Spots: {
                  parkingLots.filter(spot => {
                    const spotId = String(spot.selectedSpots || '');
                    return spotId && !spotId.startsWith("R");
                  }).length
                }</p>
                <p>Booked: {
                  bookedSpots.filter(spotId => !String(spotId).startsWith("R")).length
                }</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800">4-Wheeler</h4>
                <p>Total Spots: {
                  parkingLots.filter(spot => {
                    const spotId = String(spot.selectedSpots || '');
                    return spotId && spotId.startsWith("R");
                  }).length
                }</p>
                <p>Booked: {
                  bookedSpots.filter(spotId => String(spotId).startsWith("R")).length
                }</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ParkingLots;
