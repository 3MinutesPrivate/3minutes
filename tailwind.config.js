/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      extend: {
      colors: {
        // 品牌主背景（深紫接近 Finzo）
        midnight: "#050014",
        // 品牌紫（高亮 / 边框）
        violetBrand: "#7C3AED",
        // 霓虹绿（正向 / 按钮）
        limeBrand: "#22C55E",
        // 橙色（强调 / Call-to-action）
        amberBrand: "#F97316"
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.3)'
      }
    }
  },
  plugins: []
};
