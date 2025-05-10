import React from 'react'

import Hero from '../Components/Hero'
import AboutUs from '../Components/AboutUs'
import Services from '../Components/Services'
import ContactUs from '../Components/ContactUs'
import Footer from '../Components/Footer'

function Home({setShowLogin }) {
  return (
    <div>
      <Hero setShowLogin={setShowLogin} />
      <AboutUs/>
      <Services/>
      <ContactUs/>
      <Footer/>
      
    </div>
  )
}

export default Home
