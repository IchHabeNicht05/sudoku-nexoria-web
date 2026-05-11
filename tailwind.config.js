/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tmavé pozadí z obrázku
        'nexoria-dark': '#050507',
        'nexoria-card': '#0d0d12',
        // Barvy pro gradienty
        'accent-purple': '#6366f1',
        'accent-blue': '#3b82f6',
        'accent-cyan': '#22d3ee',
      },
      backgroundImage: {
        // Lineární gradient pro hlavní nadpisy a tlačítka
        'nexoria-gradient': 'linear-gradient(to right, #6366f1, #3b82f6)',
        // Kruhová záře v pozadí (glow efekt)
        'hero-glow': 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(5,5,7,0) 70%)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}