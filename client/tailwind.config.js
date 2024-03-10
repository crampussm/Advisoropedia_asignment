/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      colors: {
        color1: '#2aa6ee',
        color2: '#e7f0f4',
        color3: '#a2ddff',
      },
      fontFamily: {
        font1: ['Kanit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

