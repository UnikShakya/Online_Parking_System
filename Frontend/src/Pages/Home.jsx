import React from 'react'

import Hero from '../Components/Hero'

function Home({setShowLogin }) {
  return (
    <div>
      <Hero setShowLogin={setShowLogin} />
    </div>
  )
}

export default Home
