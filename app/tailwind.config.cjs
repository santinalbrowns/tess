/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#7844ec',
        background: {
          DEFAULT: "#1d1d2a",
          light: "#272737",
          dark: "#1b1925"
        }
      }
    },
  },
  plugins: [],
}

