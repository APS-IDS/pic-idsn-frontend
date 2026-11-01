/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // TUS COLORES PERSONALIZADOS:
        navy: {
          DEFAULT: '#1c3a5e',
          dark: '#152c48',
        },
        teal: {
          DEFAULT: '#0f7a68',
          dark: '#0b5c4d',
          light: '#e3f4ef',
        },
        green: {
          brand: '#4caf50',
          dark: '#3d8b40',
          // Usamos 'brand' para no sobreescribir el green de tailwind si no quieres
        },
        yellow: {
          brand: '#f2c94c',
        },
        // Colores de estructura e interfaz
        'app-bg': '#f4f6f8',
        'app-card': '#ffffff',
        'app-border': '#dfe3e8',
        'app-text': '#1f2937',
        'app-muted': '#5b6673',
      },
    },
  },
  plugins: [],
};
