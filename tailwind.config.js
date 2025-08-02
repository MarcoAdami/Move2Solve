// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // Per le pagine Next.js 13+ App Router
    './pages/**/*.{js,ts,jsx,tsx,mdx}', // Per le pagine Next.js Pages Router
    './components/**/*.{js,ts,jsx,tsx,mdx}', // Per i tuoi componenti
    // Aggiungi altri percorsi se hai cartelle diverse per i componenti
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};