/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#F8F6F4',
          100: '#EFE9E2',
          200: '#DFD3C4',
          300: '#C7B5A0',
          400: '#A78F74',
          500: '#826950',
          600: '#644E3B',
          700: '#4D3A2C',
          800: '#382A20',
          900: '#261C15',
          950: '#18110D',
        },
        terracotta: {
          50: '#FDF6F3',
          100: '#FAECE5',
          200: '#F5D6C7',
          300: '#EEB79F',
          400: '#E38A66',
          500: '#D4683B',
          600: '#BD4D24',
          700: '#9C3B19',
          800: '#7E3218',
          900: '#672D17',
        },
        cream: {
          50: '#FAF8F5',
          100: '#F5F0EB',
          200: '#ECE4D8',
          300: '#DFCFC0',
          400: '#CEBAA4',
          500: '#BC9F84',
        },
        caramel: {
          50: '#FEF9EE',
          100: '#FDF1D7',
          200: '#FAE0AE',
          300: '#F6CB7D',
          400: '#F1AF4C',
          500: '#E39025',
          600: '#C6701B',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'warm-sm': '0 2px 8px -2px rgba(56, 42, 32, 0.06), 0 1px 4px -1px rgba(56, 42, 32, 0.04)',
        'warm': '0 4px 20px -2px rgba(56, 42, 32, 0.08), 0 2px 6px -1px rgba(56, 42, 32, 0.04)',
        'warm-lg': '0 12px 32px -4px rgba(56, 42, 32, 0.12), 0 4px 12px -2px rgba(56, 42, 32, 0.06)',
      }
    },
  },
  plugins: [],
}
