/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        anthracite: '#EAF5FF',
        cream: '#050B16',
        terracotta: '#6EE7FF',
        ochre: '#8AA9FF',
        'warm-gray': '#9DB0C7',
      },
      fontFamily: {
        display: ['"Segoe UI"', '"Work Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Work Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.2em',
      },
    },
  },
  plugins: [],
};
