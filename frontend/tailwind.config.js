/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cozy: {
          cream: "#FFFDF9",
          canvas: "#FFF9F2",
          peach: "#FFDFD3",
          pink: "#FFB7B2",
          green: "#C8E6C9",
          yellow: "#FFDAC1",
          lavender: "#E0BBE4",
          violet: "#B57EDC",
          sky: "#E3F2FD",
          night: "#1A252F",
          dusk: "#2C3E50",
          bark: "#6D4C41",
          clay: "#A1887F",
          brown: "#D7CCC8",
          dark: "#4A3E3D",
        }
      },
      fontFamily: {
        cozy: ["Quicksand", "Outfit", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      animation: {
        'bounce-slow': 'bounce 2.5s infinite',
        'float-slow': 'float 5s ease-in-out infinite',
        'float-medium': 'float 4s ease-in-out infinite',
        'float-fast': 'float 3s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(1.5deg)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: 0.9, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.03)' },
        }
      },
      boxShadow: {
        'cozy-sm': '0 4px 6px -1px rgba(74, 62, 61, 0.05), 0 2px 4px -1px rgba(74, 62, 61, 0.03)',
        'cozy': '0 10px 25px -5px rgba(74, 62, 61, 0.1), 0 8px 10px -6px rgba(74, 62, 61, 0.08)',
        'cozy-lg': '0 20px 35px -5px rgba(74, 62, 61, 0.12), 0 10px 10px -5px rgba(74, 62, 61, 0.08)',
        'bubble': '0 8px 0px 0px rgba(74, 62, 61, 0.15)',
        'bubble-active': '0 2px 0px 0px rgba(74, 62, 61, 0.15)',
      }
    },
  },
  plugins: [],
}
