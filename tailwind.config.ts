import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        heading: ["var(--font-heading)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
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
        lavender: {
          light: "hsl(var(--lavender-light) / 0.18)",
          DEFAULT: "hsl(var(--lavender))",
          dark: "hsl(var(--lavender-dark))",
          glow: "hsl(var(--lavender-glow) / 0.18)",
        },
        mint: {
          light: "hsl(var(--mint-light) / 0.15)",
          DEFAULT: "hsl(var(--mint))",
          dark: "hsl(var(--mint-dark))",
          glow: "hsl(var(--mint-glow) / 0.15)",
        },
        peach: {
          light: "hsl(var(--peach-light) / 0.14)",
          DEFAULT: "hsl(var(--peach))",
        },
        gold: {
          light: "hsl(var(--gold-light) / 0.16)",
          DEFAULT: "hsl(var(--gold))",
          glow: "hsl(var(--gold-glow) / 0.16)",
        },
        sunshine: {
          light: "hsl(var(--sunshine-light) / 0.16)",
          DEFAULT: "hsl(var(--sunshine))",
        },
        navy: {
          DEFAULT: "hsl(var(--navy))",
          light: "hsl(var(--navy-light))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
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
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "blob-drift": {
          from: { transform: "translate(0,0) scale(1)" },
          to: { transform: "translate(30px,20px) scale(1.08)" },
        },
        "word-in": {
          "0%": { opacity: "0", filter: "blur(10px)", transform: "translateY(40px)" },
          "60%": { opacity: "0.6", filter: "blur(3px)", transform: "translateY(-4px)" },
          "100%": { opacity: "1", filter: "blur(0)", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 4s ease-in-out infinite",
        "blob-drift": "blob-drift ease-in-out infinite alternate",
        "word-in": "word-in 0.65s ease both",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
