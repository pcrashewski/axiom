/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        anthracite: '#1C1B1A',
        cream: '#F7F2E9',
        terracotta: '#C9764A',
        ochre: '#C9A227',
        'warm-gray': '#8C8479',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['"Work Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.2em',
      },
    },
  },
  plugins: [],
};
