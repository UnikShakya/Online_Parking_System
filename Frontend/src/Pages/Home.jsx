import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "../Components/Hero";
import AboutUs from "../Components/AboutUs";
import Services from "../Components/Services";
import ContactUs from "../Components/ContactUs";
import Footer from "../Components/Footer";
import Location from "../Components/Location";

function Home({ setShowLogin }) {
  const { hash } = useLocation();

  useEffect(() => {
    // Wait for the DOM to be fully rendered
    const scrollToSection = () => {
      if (hash) {
        const sectionId = hash.replace("#", ""); // e.g., '#location' -> 'location'
        const element = document.getElementById(sectionId);
        if (element) {
          const offset = 100; // Adjusted for navbar height and padding
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: elementPosition - offset,
            behavior: "smooth",
          });
        } else {
          // Retry after a delay to handle dynamic rendering
          setTimeout(() => {
            const retryElement = document.getElementById(sectionId);
            if (retryElement) {
              const elementPosition = retryElement.getBoundingClientRect().top + window.scrollY;
              window.scrollTo({
                top: elementPosition - offset,
                behavior: "smooth",
              });
            }
          }, 500); // Increased delay for map rendering
        }
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    // Run after initial render and map load
    const timeout = setTimeout(scrollToSection, 100);
    return () => clearTimeout(timeout);
  }, [hash]);

  return (
    <div>
      <Hero setShowLogin={setShowLogin} />
      <AboutUs />
      <Services />
      <Location />
      <ContactUs />
      <Footer />
    </div>
  );
}

export default Home;