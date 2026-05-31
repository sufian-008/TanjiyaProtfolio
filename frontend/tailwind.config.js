/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // support light / dark toggle
  theme: {
    extend: {
      colors: {
        background: {
          light: '#ffffff',
          dark: '#030303',
        },
        foreground: {
          light: '#111111',
          dark: '#f5f5f7',
        },
        card: {
          light: '#f9f9fb',
          dark: '#0a0a0c',
        },
        border: {
          light: '#e5e5e7',
          dark: '#161618',
        },
        accent: {
          light: '#555555',
          dark: '#a1a1a6',
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'grid-pattern': "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
        'grid-pattern-light': "radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px)",
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
