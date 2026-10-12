/** @type {import('tailwindcss').Config} */
// Fincan Sohbet — "Modern Kahvehane" tasarım sistemi
// Token isimleri korunmuştur (coffee / cream / terracotta / caramel), böylece tüm sayfalar yeni paleti otomatik alır.
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Espresso — mürekkep ve koyu yüzeyler
        coffee: {
          50: '#F7F2EC',
          100: '#EDE3D8',
          200: '#DCCBB8',
          300: '#C2A88E',
          400: '#9E8166',
          500: '#7A5E47',
          600: '#5E4634',
          700: '#473427',
          800: '#33251C',
          900: '#241A14',
          950: '#17100C',
        },
        // Krem kâğıt — zeminler
        cream: {
          50: '#FBF7F0',
          100: '#F6EFE4',
          200: '#EEE2CF',
          300: '#E2D0B5',
          400: '#D1B994',
          500: '#BC9F78',
        },
        // Kiremit — ana vurgu / CTA
        terracotta: {
          50: '#FDF3EE',
          100: '#FBE3D7',
          200: '#F6C4AC',
          300: '#EF9D78',
          400: '#E6774D',
          500: '#D9542C',
          600: '#C24420',
          700: '#A0361A',
          800: '#7F2D19',
          900: '#672816',
        },
        // Hardal — ikincil vurgu
        caramel: {
          50: '#FEF8EA',
          100: '#FCEDC7',
          200: '#F8DB8F',
          300: '#F2C65A',
          400: '#E8B33A',
          500: '#D39820',
          600: '#B07816',
        },
        // Fıstık — tamamlayıcı
        pistachio: {
          50: '#F3F6EE',
          100: '#E3EBD8',
          200: '#C8D8B2',
          300: '#A6BF87',
          400: '#8AA96A',
          500: '#7A9A5B',
          600: '#5F7B45',
          700: '#4A5F37',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
      },
      boxShadow: {
        'warm-sm': '0 1px 2px rgba(36, 26, 20, 0.06), 0 2px 8px -2px rgba(36, 26, 20, 0.06)',
        'warm': '0 2px 4px rgba(36, 26, 20, 0.04), 0 8px 24px -6px rgba(36, 26, 20, 0.12)',
        'warm-md': '0 4px 8px rgba(36, 26, 20, 0.05), 0 14px 32px -8px rgba(36, 26, 20, 0.16)',
        'warm-lg': '0 8px 16px rgba(36, 26, 20, 0.06), 0 24px 48px -12px rgba(36, 26, 20, 0.22)',
        // Baskı/afiş hissi veren sert gölge
        'print': '4px 4px 0 0 #241A14',
        'print-sm': '2px 2px 0 0 #241A14',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        scaleUp: { from: { opacity: '0', transform: 'scale(.96) translateY(6px)' }, to: { opacity: '1', transform: 'none' } },
        rise: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'none' } },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        steam: {
          '0%': { opacity: '0', transform: 'translateY(6px) scaleX(1)' },
          '40%': { opacity: '.7' },
          '100%': { opacity: '0', transform: 'translateY(-18px) scaleX(1.4)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn .25s ease-out both',
        scaleUp: 'scaleUp .28s cubic-bezier(.2,.8,.2,1) both',
        rise: 'rise .7s cubic-bezier(.2,.8,.2,1) both',
        marquee: 'marquee 40s linear infinite',
        steam: 'steam 2.8s ease-out infinite',
      },
    },
  },
  plugins: [],
}
