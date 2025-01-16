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
        bodyColor: "#475569",
        textColor: "#E3E3E3",
        designColor: "#09A0B8",
      },
    },
  },
  plugins: [],
}
