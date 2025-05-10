import React from 'react';
import guestSatisfaction from "../assets/guestSatisfaction.jpg";
import clearWalkway from "../assets/clearWalkways.jpg";
import trafficControl from "../assets/trafficControl.jpg";

function Services() {
  const services = [
    { number: '01', title: 'Traffic Control', image: trafficControl },
    { number: '02', title: 'Clear Walkways', image: clearWalkway },
    { number: '03', title: 'Guest Satisfaction', image: guestSatisfaction }
  ];

  return (
    <section id='services' className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-center text-4xl md:text-5xl font-bold text-gray-900 mb-16">
        Our Services
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service) => (
          <div key={service.number} className="text-center">
            <div className="relative group overflow-hidden h-84">
              <img 
                src={service.image} 
                alt={service.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-0 transition-all duration-500 flex items-center justify-center">
                <div className="text-white group-hover:text-transparent transition-all duration-300">
                  <span className="block text-4xl font-bold mb-2">{service.number}</span>
                  <h3 className="text-2xl font-semibold">{service.title}</h3>   
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Services;