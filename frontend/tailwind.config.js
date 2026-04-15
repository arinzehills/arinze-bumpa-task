/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-primary": "#2255ff",
        "brand-secondary": "#2255ff",
        "text-primary": "#1d1d1f",
        "text-secondary": "#424245",
        "text-muted": "#86868b",
        "bg-primary": "#ffffff",
        "bg-secondary": "#f5f5f7",
        "bg-elevated": "#ececf1",
        "bg-light": "#ffffff",
        "border-color": "#e5e5e7",
        "success": "#34c759",
        "error": "#ff3b30",
        "warning": "#ff9500",
        "info": "#2255ff",
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
}