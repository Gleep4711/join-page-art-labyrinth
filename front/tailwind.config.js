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
        orange: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        matchaGreen: {
          DEFAULT: '#A8B400',
          50: '#C0CCA440',
          hover: '#7A8D00',
        },
        customOrange: {
          DEFAULT: '#F07B17',
          hover: '#BE6010',
          disabled: '#F6D8B4',
        },

      },
    },
  },
  plugins: [],
};

