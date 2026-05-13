/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'dhl-red': '#D40511',
        'dhl-yellow': '#FFCC00',
        'dhl-dark': '#1C1C1C',
        'dhl-light': '#F6F6F6',
        'dhl-white': '#FFFFFF',
        'dhl-border': '#EEEEEE',
        'dhl-muted': '#AAAAAA',
      },
      fontFamily: {
        'barlow': ['Barlow', 'sans-serif'],
      },
      backgroundImage: {
        'diagonal-lines': 'repeating-linear-gradient(45deg, rgba(212,5,17,0.04) 0px, rgba(212,5,17,0.04) 1px, transparent 1px, transparent 10px)',
        'red-glow': 'radial-gradient(circle at 20% 80%, rgba(212,5,17,0.15) 0%, transparent 50%)',
        'yellow-glow': 'radial-gradient(circle at 80% 20%, rgba(255,204,0,0.1) 0%, transparent 50%)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
    },
  },
  plugins: [],
}
