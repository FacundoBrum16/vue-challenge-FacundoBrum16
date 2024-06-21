module.exports = {
  purge: ['./public/**/*.html', './src/**/*.vue'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        current: 'currentColor',
        background: '#0D0F18',
        card: '#20222A',
      },
      borderColor: {
        'custom-white': 'hsla(0, 0%, 100%, 0.1)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
