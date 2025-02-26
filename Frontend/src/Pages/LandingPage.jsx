// import React from "react";

// const LandingPage = () => {
//   return (
//     <div className="bg-gradient-to-br from-blue-500 to-purple-600 min-h-screen">
//       {/* Header */}
//       <header className="bg-gradient-to-r from-blue-700 to-purple-800 text-white p-4 flex justify-between items-center shadow-lg">
//         <h1 className="text-3xl font-bold">ParkEase</h1>
//         <nav>
//           <ul className="flex space-x-6">
//             <li><a href="#features" className="hover:underline">Features</a></li>
//             <li><a href="#how-it-works" className="hover:underline">How It Works</a></li>
//             <li><a href="#pricing" className="hover:underline">Pricing</a></li>
//             <li><a href="#contact" className="hover:underline">Contact</a></li>
//             <li><button className="bg-white text-blue-700 px-4 py-2 rounded">Login</button></li>
//           </ul>
//         </nav>
//       </header>
      
//       {/* Hero Section */}
//       <section className="text-center py-64 bg-gradient-to-r from-purple-700 to-blue-600 text-white relative">
//         <div className="absolute inset-0 bg-black opacity-50"></div>
//         <div className="relative z-10">
//           <h2 className="text-6xl font-bold">Find & Reserve Parking Easily</h2>
//           <p className="mt-6 text-xl">Real-time availability, secure booking, and hassle-free parking.</p>
//           <button className="mt-8 bg-white text-blue-700 px-8 py-3 rounded text-lg font-semibold shadow-lg">Get Started</button>
//         </div>
//         <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://source.unsplash.com/1920x1080/?parking,car-parking')" }}></div>
//       </section>
      
//       {/* How It Works Section */}
//       <section id="how-it-works" className="py-20 px-10 bg-gradient-to-bl from-blue-400 to-purple-500 text-white text-center">
//         <h2 className="text-4xl font-bold">How It Works</h2>
//         <div className="grid md:grid-cols-3 gap-12 mt-12">
//           <div className="bg-white p-8 shadow-lg rounded-lg text-black">
//             <h3 className="text-2xl font-semibold">Step 1: Search</h3>
//             <p className="mt-4">Enter your location and find available parking spaces.</p>
//           </div>
//           <div className="bg-white p-8 shadow-lg rounded-lg text-black">
//             <h3 className="text-2xl font-semibold">Step 2: Book</h3>
//             <p className="mt-4">Reserve your spot in seconds with secure payment options.</p>
//           </div>
//           <div className="bg-white p-8 shadow-lg rounded-lg text-black">
//             <h3 className="text-2xl font-semibold">Step 3: Park</h3>
//             <p className="mt-4">Arrive and park hassle-free with instant confirmation.</p>
//           </div>
//         </div>
//       </section>
      
//       {/* Features Section */}
//       <section id="features" className="py-20 px-10 bg-gradient-to-br from-blue-400 to-purple-500 text-white">
//         <h2 className="text-4xl font-bold text-center">Why Choose ParkEase?</h2>
//         <div className="grid md:grid-cols-3 gap-12 mt-12">
//           <div className="bg-white p-8 shadow-lg rounded-lg text-center text-black">
//             <h3 className="text-2xl font-semibold">Real-Time Availability</h3>
//             <p className="mt-4">Get instant updates on available parking spaces.</p>
//           </div>
//           <div className="bg-white p-8 shadow-lg rounded-lg text-center text-black">
//             <h3 className="text-2xl font-semibold">Secure Payments</h3>
//             <p className="mt-4">Pay safely using multiple payment options.</p>
//           </div>
//           <div className="bg-white p-8 shadow-lg rounded-lg text-center text-black">
//             <h3 className="text-2xl font-semibold">Easy Booking</h3>
//             <p className="mt-4">Reserve your spot in just a few clicks.</p>
//           </div>
//         </div>
//       </section>
      
//       {/* Testimonials */}
//       <section className="py-20 px-10 bg-gradient-to-bl from-purple-500 to-blue-400 text-white text-center">
//         <h2 className="text-4xl font-bold">What Our Users Say</h2>
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
//           <div className="bg-white text-black p-6 rounded-lg shadow-lg">
//             <p>“ParkEase made finding parking super easy and stress-free!”</p>
//             <h4 className="mt-4 font-semibold">- Alex Johnson</h4>
//           </div>
//           <div className="bg-white text-black p-6 rounded-lg shadow-lg">
//             <p>“Secure and convenient booking process. Highly recommend!”</p>
//             <h4 className="mt-4 font-semibold">- Sarah Lee</h4>
//           </div>
//           <div className="bg-white text-black p-6 rounded-lg shadow-lg">
//             <p>“Affordable pricing and real-time availability. Fantastic!”</p>
//             <h4 className="mt-4 font-semibold">- Mark Smith</h4>
//           </div>
//         </div>
//       </section>
      
//       {/* Call to Action */}
//       <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white text-center">
//         <h2 className="text-4xl font-bold">Ready to Park with Ease?</h2>
//         <p className="mt-4 text-lg">Sign up now and enjoy hassle-free parking today!</p>
//         <button className="mt-8 bg-white text-blue-700 px-8 py-3 rounded text-lg font-semibold shadow-lg">Get Started</button>
//       </section>
      
//       {/* Footer */}
//       <footer className="bg-gradient-to-r from-blue-800 to-purple-900 text-white text-center py-6 mt-16">
//         <p>&copy; 2025 ParkEase. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default LandingPage;