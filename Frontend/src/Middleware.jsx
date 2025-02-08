import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner'; // Import the new QR scanner
import axios from 'axios';

function Middleware() {
  const [scannedData, setScannedData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Function to handle QR code scan
  const handleScan = async (data) => {
    if (data) {
      try {
        const ticketDetails = JSON.parse(data); // Parse the scanned QR data

        setScannedData(ticketDetails); // Update the scanned data
        setErrorMessage(null); // Clear any previous errors

        // Optionally, send the data to the backend to log the user info
        setIsProcessing(true);
        await axios.post('/api/log-ticket', ticketDetails); // Backend endpoint for logging
        setIsProcessing(false);
      } catch (error) {
        setErrorMessage('Invalid QR Code or Data');
        setIsProcessing(false);
      }
    }
  };

  // Function to handle QR code scan error
  const handleError = (err) => {
    console.error(err);
    setErrorMessage('Error scanning QR code');
  };

  return (
    <div className="p-5 max-h-screen flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold text-center mb-6">Scan QR Code</h1>

      {/* QR code scanner */}
      <div className="mb-6 w-full max-w-md">
        <QrScanner
          delay={300}
          style={{ width: '100%' }}
          onScan={handleScan}
          onError={handleError}
        />
      </div>

      {/* Error message */}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      {/* Display scanned data */}
      {scannedData && (
        <div className="bg-bodyColor text-white w-3/4 max-w-lg rounded-lg p-6 mt-4">
          <h2 className="text-xl text-center font-bold mb-4">Scanned Ticket Details</h2>
          <div className="flex flex-col items-center">
            <p><strong>Booking ID:</strong> {scannedData.bookingId}</p>
            <p><strong>Spots:</strong> {scannedData.spots.join(", ")}</p>
            <p><strong>Total Price:</strong> Rs {scannedData.price}</p>
            <p><strong>Date:</strong> {scannedData.date}</p>
            <p><strong>Time:</strong> {scannedData.time}</p>
          </div>
        </div>
      )}

      {/* Processing indicator */}
      {isProcessing && (
        <div className="mt-4 text-center text-blue-500">
          <p>Processing...</p>
        </div>
      )}
    </div>
  );
}

export default Middleware;
