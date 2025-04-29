module.exports = {
    content: [
    "./app/**/*.{js,ts,jsx,tsx}", // for App Router
    "./pages/**/*.{js,ts,jsx,tsx}", // just in case you're mixing
    "./components/**/*.{js,ts,jsx,tsx}", // include components if needed
    ],  
    theme: {
    extend: {
      fontFamily: {
        poppins: ['var(--font-poppins)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

