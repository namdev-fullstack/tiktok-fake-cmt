/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        tiktok: {
          red: '#fe2c55',
          cyan: '#25f4ee',
          gray: '#8a8b91',
          lightGray: '#73747b',
          darkBg: '#121212',
        }
      }
    },
  },
  plugins: [],
};
