/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-primary": "#000000",
        "brand-secondary": "#0084FF",
        "text-primary": "#ffffff",
        "text-secondary": "#a1a1a6",
        "text-muted": "#666666",
        "bg-primary": "#000000",
        "bg-secondary": "#1c1c1e",
        "bg-elevated": "#2c2c2e",
        "bg-light": "#f5f5f7",
        "border-color": "rgba(255, 255, 255, 0.1)",
        "success": "#34c759",
        "error": "#ff3b30",
        "warning": "#ff9500",
        "info": "#0084FF",
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Helvetica", "Arial", "sans-serif"],
      },
      backgroundImage: {
        "glass": "rgba(255, 255, 255, 0.1)",
        "glass-dark": "rgba(0, 0, 0, 0.3)",
      },
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
      boxShadow: {
        "glass": "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        "glass-dark": "inset 0 8px 32px 0 rgba(31, 38, 135, 0.37)",
      },
      borderRadius: {
        "glass": "12px",
      },
    },
  },
  plugins: [],
}