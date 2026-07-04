/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // 📌 이브님의 컴포넌트들을 감시할 경로
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}