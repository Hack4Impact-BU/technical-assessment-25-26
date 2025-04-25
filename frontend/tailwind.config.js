import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Raleway', ...defaultTheme.fontFamily.sans],
        serif: ['Lora',    ...defaultTheme.fontFamily.serif],
      },
      colors: {
        sunrise: {
          50:  '#fffbea',
          100: '#fff3c4',
          200: '#fce588',
          300: '#fadb5f',
          400: '#f7c948',
          500: '#f0b429',
          600: '#de911d',
          700: '#cb6e17',
          800: '#b44d12',
          900: '#8d2b0b',
        },
        sunset: {
          50:  '#fdf2f8',
          100: '#fce7f3',
          200: '#fad1e8',
          300: '#f8b4d9',
          400: '#f17eb8',
          500: '#e74694',
          600: '#d61f69',
          700: '#bf125d',
          800: '#99154b',
          900: '#751A3d',
        },
      },
    },
  },
  plugins: []
};
