import React from 'react'
import QRCode from "react-qr-code";
import { useLocation } from 'react-router-dom';
import { useRef } from 'react';
import html2pdf from 'html2pdf.js';

function BookingTicket() {
  const location = useLocation();
  const selectedSpots = location.state?.selectedSpots || []; // Default to empty array if undefined

  const ticketDetails = {
    bookingId: `ID-${Math.floor(Math.random() * 100000)}`, // Example booking ID
    spots: selectedSpots, // Use the selected spots passed from ParkingLot page
    price: selectedSpots.length * 25, // Rs 25 per spot
    date: new Date().toLocaleDateString(), // Current date
    time: new Date().toLocaleTimeString(), // Current time
  };

  const qrData = JSON.stringify(ticketDetails); // QR code data (ticket details)

  const ticketRef = useRef(); // Reference to the ticket container for PDF generation

  // Function to download the ticket as PDF
  const handleDownload = () => {
    const element = ticketRef.current;
    const options = {
      filename: `Booking_Ticket_${ticketDetails.bookingId}.pdf`, // Custom filename
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      html2canvas: { scale: 4 },
      image: { type: 'jpeg', quality: 0.98 },
      margin: [40, 0, 0, 0]
    };
    html2pdf().from(element).set(options).save();
  };

  return (
    <div className="p-5 max-h-screen flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold text-center my-14">This is your booking Ticket</h1>
      <div 
        ref={ticketRef} 
        className="bg-bodyColor text-white w-3/4 max-w-lg rounded-lg p-6 mx-auto" // Added mx-auto for centering
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }} // Ensure centering
      >
        <div className="w-full">
          <h2 className="text-xl text-center font-bold mb-4">Booking Details</h2>
          <div className='flex justify-between items-center'>
            <div className="mb-4">
              <p><strong>Booking ID:</strong> {ticketDetails.bookingId}</p>
              <p><strong>Spots:</strong> {ticketDetails.spots.join(", ")}</p>
              <p><strong>Total Price:</strong> Rs {ticketDetails.price}</p>
              <p><strong>Date:</strong> {ticketDetails.date}</p>
              <p><strong>Time:</strong> {ticketDetails.time}</p>
            </div>
            <div className="flex justify-center">
              <QRCode value={qrData} size={200} /> {/* QR Code showing ticket details */}
            </div>
          </div>
        </div>
      </div>
      {/* Download Button */}
      <div className="mt-4">
        <button
          onClick={handleDownload}
          className="bg-designColor text-white rounded-full px-6 py-2 hover:bg-opacity-70"
        >
          Download Ticket
        </button>
      </div>
    </div>
  );
}

export default BookingTicket;
