/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: '#0000FF'
      },
      screens: {
        tablet: '768px'
      },
      maxWidth: {
        phone: '430px',
        tablet: '820px'
      }
    }
  },
  plugins: []
}


