import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  safelist: [
    // Theme background colors and gradients
    "bg-gradient-to-br",
    "bg-gradient-to-tr",
    "bg-white",
    // Classic & Ivory themes
    "from-gray-50",
    "to-white",
    "border-gray-200",
    // Pacific Dream
    "from-cyan-100",
    "to-blue-200",
    "border-cyan-200",
    // Golden Hour
    "from-yellow-100",
    "via-orange-200",
    "to-red-200",
    "border-yellow-200",
    // Emerald Isle
    "from-green-100",
    "to-teal-200",
    "border-green-200",
    // Amethyst
    "from-purple-200",
    "to-indigo-200",
    "border-purple-200",
    // Cosmic Dust
    "from-gray-900",
    "via-purple-900",
    "to-black",
    "border-gray-700",
    // Cherry Blossom
    "from-pink-100",
    "to-rose-200",
    "border-pink-200",
    // Solar Flare
    "from-yellow-400",
    "via-orange-500",
    "to-red-600",
    "border-yellow-500",
    // Mojave Dusk
    "from-orange-200",
    "via-rose-300",
    "to-indigo-300",
    "border-orange-200",
    // Mint Condition
    "via-emerald-50",
    "to-teal-100",
    "border-emerald-200",
    // Obsidian
    "from-slate-800",
    "via-gray-900",
    "border-slate-700",
    // Raspberry Sorbet
    "to-fuchsia-300",
    "border-rose-200",
    // Alpine Glow
    "from-slate-50",
    "to-cyan-100",
    "border-slate-200",
    // Neptune
    "from-blue-900",
    "via-indigo-900",
    "border-blue-800",

    // Text colors
    "text-gray-900",
    "text-gray-800",
    "text-cyan-900",
    "text-orange-900",
    "text-green-900",
    "text-purple-900",
    "text-gray-200",
    "text-rose-900",
    "text-white",
    "text-indigo-900",
    "text-teal-900",
    "text-gray-300",
    "text-fuchsia-900",
    "text-slate-800",
    "text-blue-200",

    // Accent colors
    "text-blue-600",
    "text-gray-500",
    "text-blue-700",
    "text-red-600",
    "text-teal-700",
    "text-indigo-700",
    "text-purple-400",
    "text-pink-700",
    "text-yellow-200",
    "text-rose-700",
    "text-emerald-600",
    "text-cyan-400",
    "text-rose-600",
    "text-cyan-700",
    "text-cyan-300",

    // Button styles - background colors
    "bg-gray-800",
    "hover:bg-gray-900",
    "bg-gradient-to-r",
    "from-cyan-500",
    "to-blue-500",
    "hover:from-cyan-600",
    "hover:to-blue-600",
    "from-orange-500",
    "to-red-500",
    "hover:from-orange-600",
    "hover:to-red-600",
    "from-green-500",
    "to-teal-500",
    "hover:from-green-600",
    "hover:to-teal-600",
    "from-purple-500",
    "to-indigo-500",
    "hover:from-purple-600",
    "hover:to-indigo-600",
    "from-purple-600",
    "to-indigo-600",
    "hover:from-purple-700",
    "hover:to-indigo-700",
    "from-pink-500",
    "to-rose-500",
    "hover:from-pink-600",
    "hover:to-rose-600",
    "from-yellow-300",
    "to-orange-400",
    "hover:from-yellow-400",
    "hover:to-orange-500",
    "from-rose-600",
    "to-indigo-600",
    "hover:from-rose-700",
    "hover:to-indigo-700",
    "from-emerald-500",
    "to-teal-500",
    "hover:from-emerald-600",
    "hover:to-teal-600",
    "bg-slate-700",
    "hover:bg-slate-600",
    "from-rose-500",
    "to-fuchsia-500",
    "hover:from-rose-600",
    "hover:to-fuchsia-600",
    "from-slate-600",
    "to-cyan-700",
    "hover:from-slate-700",
    "hover:to-cyan-800",
    "from-blue-700",
    "to-cyan-700",
    "hover:from-blue-800",
    "hover:to-cyan-800",

    // Button text colors
    "text-white",
    "text-black",

    // Border colors for accent animations
    "border-blue-600",
    "border-gray-500",
    "border-blue-700",
    "border-red-600",
    "border-teal-700",
    "border-indigo-700",
    "border-purple-400",
    "border-pink-700",
    "border-yellow-200",
    "border-rose-700",
    "border-emerald-600",
    "border-cyan-400",
    "border-rose-600",
    "border-cyan-700",
    "border-cyan-300",

    // 3D Transform utilities
    "perspective-1000",
    "transform",
    "hover:rotate-y-6",
    "hover:scale-105",
    "shadow-xl",
    "hover:shadow-2xl",
    "hover:shadow-blue-900/20",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        ripple: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "50%": { transform: "scale(1)", opacity: "0.2" },
          "100%": { transform: "scale(1.2)", opacity: "0" },
        },
        "ripple-delayed": {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "50%": { transform: "scale(1)", opacity: "0.2" },
          "100%": { transform: "scale(1.2)", opacity: "0" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        ripple: "ripple 2s ease-out infinite",
        "ripple-delayed": "ripple-delayed 2s ease-out infinite 1s",
        shimmer: "shimmer 2s linear infinite",
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      perspective: {
        "1000": "1000px",
      },
      transformStyle: {
        "preserve-3d": "preserve-3d",
      },
      rotate: {
        "y-6": "rotateY(6deg)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
