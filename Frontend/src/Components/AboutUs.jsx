import React, { useState } from 'react';
import aboutUsImage from "../assets/aboutUs.png"; // Make sure this path is correct

function AboutUs() {
    const [activeSection, setActiveSection] = useState(null);

    const toggleSection = (section) => {
        setActiveSection(activeSection === section ? null : section);
      };
  return (
    <section id='about-us' className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        {/* Image Section - Full width on mobile, half on desktop */}
        <div className="w-full lg:w-1/2">
          <img 
            src={aboutUsImage} 
            alt="ParkEase Valet Service" 
            className="w-full h-auto rounded-xl object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="w-full lg:w-1/2 space-y-6">
          {/* Main Heading */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 leading-tight">
              Looking for a thorough ParkEase service?
            </h1>
            <p className="text-lg text-gray-600">
              A leading parking and hospitality services provider. Committed to becoming an expert in aviation auxiliary & more capability.
            </p>
          </div>

{/* History and Locations Section */}
<div className="flex flex-col md:flex-row gap-8 pt-6">
  {/* History Section */}
  <div className="w-full md:w-2/3 space-y-2">
    {/* History Card */}
    <div 
      className="p-4 rounded-lg bg-[#F7F7F7] border border-gray-200 cursor-pointer transition-all duration-300 ease-in-out hover:shadow-md"
      onClick={() => toggleSection('history')}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Our History</h2>
        {/* <svg 
          className={`w-5 h-5 text-gray-500 transform transition-all duration-300 ease-in-out ${activeSection === 'history' ? 'rotate-180' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg> */}
      </div>
      
   
    </div>

    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${activeSection === 'history' ? 'max-h-40 mt-2' : 'max-h-0'}`}>
        <p className="text-gray-600 pb-2">
          As a small business servicing a select few clients, we grew to service multiple venues simultaneously.
        </p>
      </div>

    {/* Locations Card */}
    <div 
      className="p-4 rounded-lg bg-[#F7F7F7] border border-gray-200 cursor-pointer transition-all duration-300 ease-in-out hover:shadow-md"
      onClick={() => toggleSection('locations')}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">Our Locations</h3>
        {/* <svg 
          className={`w-5 h-5 text-gray-500 transform transition-all duration-300 ease-in-out ${activeSection === 'locations' ? 'rotate-180' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg> */}
      </div>
      
    
    </div>
    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${activeSection === 'locations' ? 'max-h-40 mt-4' : 'max-h-0'}`}>
        <p className="text-gray-600 pb-2">
          Provide parkease service about the locations information we collect and how you can control it.
        </p>
      </div>
  </div>

  {/* Team Members Section */}
  <div className="w-full md:w-1/3 flex items-center justify-center transition-all duration-300 hover:scale-[1.02]">
    <div className="text-center p-6 border-2 bg-black rounded-lg w-full h-full flex items-center justify-center hover:shadow-lg transition-all duration-300">
      <h3 className="text-3xl font-bold text-white">50+ Team Members</h3>
    </div>
  </div>
</div>
        </div>
      </div>
    </section>
  );
}

export default AboutUs;