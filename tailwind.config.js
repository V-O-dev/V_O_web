/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: "#F3E8FF", // 연한 보라
          main: "#8B5CF6",  // 메인 보라 (공동 버튼 등)
          dark: "#6D28D9",  // 짙은 보라
        }
      },
    },
  },
  plugins: [],
}