/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#0F172A',
        emerald: '#10B981',
        crimson: '#DC2626'
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.3)'
      }
    }
  },
  plugins: []
};
