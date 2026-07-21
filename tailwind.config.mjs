/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        parchment: {
          DEFAULT: '#1a1410',
          light: '#2a2218',
          dark: '#0f0b08',
        },
        gold: {
          DEFAULT: '#c9a84c',
          light: '#e8c96a',
          dark: '#a8872e',
        },
        amber: {
          DEFAULT: '#d4a574',
          light: '#e8c4a0',
        },
        ocean: {
          DEFAULT: '#1a2a3a',
          light: '#243b4a',
          dark: '#0f1a25',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"EB Garamond"', 'serif'],
      },
    },
  },
  plugins: [],
};