import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function ConnectedCircles() {
  const location = useLocation();
  
  const steps = [
    { path: '/', label: 'Select Date', step: 1 },
    { path: '/parking-lot', label: 'Parking Space', step: 2 },
    { path: '/bookingform', label: 'Customer Details', step: 3 },
    { path: '/booking-ticket', label: 'Booking Summary', step: 4 },
  ];
  
  const activeStep = steps.findIndex(step => step.path === location.pathname) + 1;
  
  return (
    <div className="flex justify-between items-center relative w-full max-w-6xl mx-auto p-4">
      {steps.map(({ path, label, step }, index) => (
        <div key={index} className="flex flex-col items-center cursor-pointer relative">
          {/* <Link to={path}> */}
            <div
              className={`rounded-full cursor-not-allowed flex items-center justify-center text-white font-bold transition-all duration-300 ${
                step <= activeStep ? 'bg-gradient-to-r from-gradientStart to-gradientEnd' : 'bg-gray-300'
              } ${step === activeStep ? 'w-20 h-20 text-3xl' : 'w-16 h-16 text-2xl'}`}
            >
              {step === 1 ? '✓' : step}
            </div>
          {/* </Link> */}
          <div className="mt-2 text-sm text-textColor">{label}</div>
          
          {/* Connecting Line */}
          {index < steps.length - 1 && (
            <div
              className={`absolute h-1 top-[40%] transform -translate-y-1/2 ${
                step < activeStep ? 'bg-gradient-to-r from-gradientStart to-gradientEnd' : 'bg-gray-300'
              }`}
              style={{ width: '20rem', left: '90%' }}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ConnectedCircles;