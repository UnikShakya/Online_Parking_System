module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens:{
        
        xs: '320px',
        sm: '375px',
        sml: '500px',
        md: '667px',
        mdl: '768px',
        lg : '960px',
        lgl: '1024px',
        xl: '1280px'
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        bodyColor: "#000",
        textColor: "#fff",
        // designColor: "#D7FC69",
        designColor:"#1f203e",
        gradientStart: "#FF5733", // Orange-red for gradient start
        gradientEnd: "#8B5CF6",   // Purple for gradient end
      },
    },
  },
  plugins: [],
}
