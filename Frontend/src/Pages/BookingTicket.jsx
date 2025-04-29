import React, { useState } from 'react';
import QRCode from "react-qr-code";
import { useLocation } from 'react-router-dom';
import { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import ConnectedCircles from '../Components/Stepper';
function BookingTicket() {

    const { state } = useLocation();  
  const  name = state?.name || "";
  const  vehicleNumber = state?.vehicleNumber || "";
  const  selectedSpots = state?.selectedSpots || [];
  const  startTime = state?.startTime || "";
  const  endTime = state?.endTime || "";
  const  totalAmount = state?.totalAmount || "";
  const  selectedDate = state?.selectedDate || "";

  const ticketDetails = {
    bookingId: `ID-${Math.floor(Math.random() * 100000)}`,
    name: name || 'NA',
    vehicleNumber: vehicleNumber || 'NA',
    selectedDate: selectedDate || 'NA',
    selectedSpots: Array.isArray(selectedSpots) ? selectedSpots.join(', ') : selectedSpots,
    startTime: startTime || 'NA',
    endTime: endTime || 'NA',
    totalAmount: totalAmount || 'NA',
    time: new Date().toLocaleTimeString(),
  };

  const qrData = JSON.stringify(ticketDetails);
  const ticketRef = useRef();

  const handleDownload = () => {
    const element = ticketRef.current;
    const options = {
      filename: `Booking_Ticket_${ticketDetails.bookingId}.pdf`,
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      html2canvas: { scale: 4 },
      image: { type: 'jpeg', quality: 0.98 },
      margin: [40, 0, 0, 0]
    };
    html2pdf().from(element).set(options).save();
  };

  return (
    <div className="p-5 bg-designColor text-textColor max-h-max mt-[5rem] flex flex-col items-center">
      <ConnectedCircles />

      <div className="flex flex-col items-center justify-center p-5">
        <h1 className="text-4xl font-bold text-textColor mb-8">Your Booking Ticket</h1>
        <div 
  ref={ticketRef} 
  className="bg-white rounded-2xl shadow-2xl w-[600px] p-8 transform transition-transform hover:scale-105"
>
          <div className="flex flex-col md:flex-row justify-between items-center max-w">
            <div className="w-full m-2 md:w-1/2">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Booking Details</h2>
              <div className="space-y-4 text-gray-700">
                <p><strong>Booking ID:</strong> <span className="text-blue-600">{ticketDetails.bookingId}</span></p>
                <p><strong>Name:</strong> {ticketDetails.name}</p>
                <p><strong>Vehicle Number:</strong> {ticketDetails.vehicleNumber}</p>
                <p><strong>Lot Number:</strong> {ticketDetails.selectedSpots}</p>
                <p><strong>Start Time:</strong> {ticketDetails.startTime}</p>
                <p><strong>End Time:</strong> {ticketDetails.endTime}</p>
                {/* <p><strong>Total Amount:</strong> Rs {ticketDetails.totalAmount}</p> */}
                <p><strong>Date:</strong> {ticketDetails.selectedDate}</p>
                {/* <p><strong>Time:</strong> {ticketDetails.time}</p> */}
              </div>
            </div>
            <div className="w-full md:w-1/2 flex justify-center mt-6 md:mt-0">
              <div className="bg-white p-4 rounded-lg border-black shadow-lg">
                <QRCode 
                  value={qrData} 
                  size={200} 
                  bgColor="transparent" 
                  fgColor="#000000" 
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={handleDownload}
          className="mt-8 bg-gradient-to-r from-gradientStart to-gradientEnd  text-white font-semibold rounded-full px-8 py-3 transition-all transform hover:scale-105"
        >
          Download Ticket
        </button>
      </div>
    </div>
  );
}

export default BookingTicket;