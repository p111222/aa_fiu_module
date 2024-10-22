/** @type {import('tailwindcss').Config} */
const config = {
  content: [],
  purge: ['./src/**/*.{js,ts,jsx,tsx}', './public/index.html'],
  theme: {
    extend: {
      screens: {
        'xs': '480px',  // Custom extra-small screen
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1440px',  // Custom double-extra-large screen
      },
    },
  },
  plugins: [],
}

export default config;