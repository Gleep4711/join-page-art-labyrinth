/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Evolventa', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        customOrange: {
          DEFAULT: '#F07B17',
          hover: '#BE6010',
        },
      },
    },
  },
  plugins: [],
};

