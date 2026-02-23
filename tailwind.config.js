/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 浅色主题背景色
        'app-bg': '#f8f9fa',
        'app-text': '#212529',
      },
    },
  },
  plugins: [],
}
