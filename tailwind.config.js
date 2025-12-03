/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#050014",      // 深紫背景
        violetBrand: "#7C3AED",   // 品牌紫
        limeBrand: "#22C55E",     // 霓虹绿
        amberBrand: "#F97316"     // 橙色 CTA
      }
    }
  },
  plugins: []
};
