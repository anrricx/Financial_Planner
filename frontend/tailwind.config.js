/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fidelity: {
          green: '#007A33',
          'green-dark': '#005A29',
          'green-light': '#26A65B',
          'gray-dark': '#2E2E2E',
          'gray-medium': '#757575',
          'gray-light': '#F5F5F5',
        },
        border: {
          'fidelity': '#E0E0E0',
          'fidelity-input': '#D5D5D5',
        },
      },
      boxShadow: {
        'fidelity': '0 1px 3px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}

