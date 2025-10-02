import tailwindAnimate from "tailwindcss-animate";
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // Brave Things Books Brand Colors - Updated to match exact vision
        forest: {
          50: "hsl(150 60% 95%)",
          100: "hsl(150 55% 88%)",
          200: "hsl(150 50% 78%)",
          300: "hsl(150 45% 65%)",
          400: "hsl(150 40% 50%)",
          500: "hsl(150 60% 35%)", // Rich, deep forest green - much more saturated
          600: "hsl(150 65% 30%)",
          700: "hsl(150 70% 25%)",
          800: "hsl(150 75% 20%)",
          900: "hsl(150 80% 15%)",
        },
        golden: {
          50: "hsl(45 100% 95%)",
          100: "hsl(45 95% 88%)",
          200: "hsl(45 90% 78%)",
          300: "hsl(45 85% 68%)",
          400: "hsl(45 80% 58%)",
          500: "hsl(45 95% 50%)", // Rich, vibrant golden yellow - much more saturated
          600: "hsl(45 90% 45%)",
          700: "hsl(45 85% 40%)",
          800: "hsl(45 80% 35%)",
          900: "hsl(45 75% 30%)",
        },
        earth: {
          50: "hsl(25 70% 95%)",
          100: "hsl(25 65% 88%)",
          200: "hsl(25 60% 78%)",
          300: "hsl(25 55% 68%)",
          400: "hsl(25 50% 55%)",
          500: "hsl(25 65% 40%)", // Rich, deep earthy brown - much more saturated
          600: "hsl(25 70% 35%)",
          700: "hsl(25 75% 30%)",
          800: "hsl(25 80% 25%)",
          900: "hsl(25 85% 20%)",
        },
        coral: {
          50: "hsl(8 100% 95%)",
          100: "hsl(8 95% 88%)",
          200: "hsl(8 90% 78%)",
          300: "hsl(8 85% 68%)",
          400: "hsl(8 80% 60%)",
          500: "hsl(8 90% 58%)", // Rich, vibrant coral - more saturated and warmer
          600: "hsl(8 85% 52%)",
          700: "hsl(8 80% 46%)",
          800: "hsl(8 75% 40%)",
          900: "hsl(8 70% 34%)",
        },
        cream: {
          50: "hsl(44 76% 97%)", // #FDF6E3 - Your neutral cream
          100: "hsl(44 70% 94%)",
          200: "hsl(44 65% 90%)",
          300: "hsl(44 60% 85%)",
          400: "hsl(44 55% 80%)",
          500: "hsl(44 50% 75%)",
          600: "hsl(44 45% 70%)",
          700: "hsl(44 40% 60%)",
          800: "hsl(44 35% 50%)",
          900: "hsl(44 30% 40%)",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      fontFamily: {
        sans: ['Nunito', 'ui-sans-serif', 'system-ui'],
        playful: ['Poppins', 'ui-sans-serif', 'system-ui'],
        script: ['Dancing Script', 'cursive'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindAnimate],
};

export default config;