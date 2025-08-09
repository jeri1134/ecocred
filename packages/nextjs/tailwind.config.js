/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  darkTheme: "dark",
  darkMode: ["selector", "[data-theme='dark']"],
  // DaisyUI theme colors
  daisyui: {
    themes: [
      {
        light: {
          primary: "#00BFA5",
          "primary-content": "#ffffff",
          secondary: "#4CAF50",
          "secondary-content": "#ffffff",
          accent: "#81C784",
          "accent-content": "#ffffff",
          neutral: "#2A2E37",
          "neutral-content": "#A6ADBB",
          "base-100": "#ffffff",
          "base-200": "#F2F7FF",
          "base-300": "#E3E9F4",
          "base-content": "#1f2937",
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#F87272",
          "--rounded-btn": "9999rem",
          ".tooltip": {
            "--tooltip-tail": "6px",
          },
          ".link": {
            textUnderlineOffset: "2px",
          },
          ".link:hover": {
            opacity: "80%",
          },
        },
      },
      {
        dark: {
          primary: "#00BFA5",
          "primary-content": "#ffffff",
          secondary: "#4CAF50",
          "secondary-content": "#ffffff",
          accent: "#81C784",
          "accent-content": "#ffffff",
          neutral: "#2A2E37",
          "neutral-content": "#A6ADBB",
          "base-100": "#1D232A",
          "base-200": "#191E24",
          "base-300": "#15191E",
          "base-content": "#A6ADBB",
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#F87272",
          "--rounded-btn": "9999rem",
          ".tooltip": {
            "--tooltip-tail": "6px",
            "--tooltip-color": "oklch(var(--p))",
          },
          ".link": {
            textUnderlineOffset: "2px",
          },
          ".link:hover": {
            opacity: "80%",
          },
        },
      },
    ],
  },
  theme: {
    extend: {
      fontFamily: {
        "space-grotesk": ["Space Grotesk", "sans-serif"],
      },
      colors: {
        'glass': {
          'light': 'rgba(255, 255, 255, 0.1)',
          'medium': 'rgba(255, 255, 255, 0.2)',
          'dark': 'rgba(0, 0, 0, 0.1)',
        },
        'eco': {
          'primary': '#00BFA5',
          'secondary': '#4CAF50',
          'accent': '#81C784',
          'light': '#E0F7FA',
          'dark': '#004D40',
        }
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(0, 191, 165, 0.5)' },
          '100%': { boxShadow: '0 0 30px rgba(0, 191, 165, 0.8)' },
        }
      }
    },
  },
};
