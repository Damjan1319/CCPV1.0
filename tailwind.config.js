/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'apple': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        'sans': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      letterSpacing: {
        'apple-tight': '-0.01em',
        'apple-normal': '0em',
        'apple-wide': '0.01em',
      },
      colors: {
        'apple-dark': {
          'bg': '#000000',
          'surface': '#1c1c1e',
          'surface-2': '#2c2c2e',
          'border': '#38383a',
          'text': '#ffffff',
          'text-secondary': '#ebebf5',
        },
        'apple-text': {
          'primary': '#1d1d1f',
          'secondary': '#86868b',
          'tertiary': '#d2d2d7',
        },
      },
    },
  },
  plugins: [],
}
