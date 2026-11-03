/** @type {import('tailwindcss').Config} */
const withVar = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: withVar("canvas"),
        surface: withVar("surface"),
        card: withVar("card"),
        elevated: withVar("elevated"),
        line: withVar("line"),
        "line-soft": withVar("line-soft"),
        ink: withVar("ink"),
        muted: withVar("muted"),
        faint: withVar("faint"),
        accent: withVar("accent"),
        "accent-bright": withVar("accent-bright"),
        blue: withVar("blue"),
        amber: withVar("amber"),
        danger: withVar("danger"),
        violet: withVar("violet"),
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.125rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgb(0 0 0 / 0.20), 0 8px 24px -12px rgb(0 0 0 / 0.45)",
        lift: "0 2px 4px rgb(0 0 0 / 0.18), 0 20px 48px -20px rgb(0 0 0 / 0.55)",
        glow: "0 0 0 1px rgb(34 197 94 / 0.35), 0 0 32px -8px rgb(34 197 94 / 0.35)",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.97)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: ".45", transform: "scale(.85)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "flame-flicker": {
          "0%, 100%": { transform: "scale(1) rotate(-2deg)" },
          "50%": { transform: "scale(1.06) rotate(2deg)" },
        },
        "streak-pop": {
          "0%": { transform: "scale(.6)", opacity: "0" },
          "60%": { transform: "scale(1.08)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        confetti: {
          "0%": { transform: "translateY(-8px) rotate(0deg)", opacity: "0" },
          "12%": { opacity: "1" },
          "100%": { transform: "translateY(180px) rotate(420deg)", opacity: "0" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up .35s cubic-bezier(.16,1,.3,1) both",
        "fade-in": "fade-in .25s ease both",
        "scale-in": "scale-in .2s cubic-bezier(.16,1,.3,1) both",
        "slide-in-right": "slide-in-right .3s cubic-bezier(.16,1,.3,1) both",
        "pulse-dot": "pulse-dot 2.4s ease-in-out infinite",
        marquee: "marquee 34s linear infinite",
        "flame-flicker": "flame-flicker 2.6s ease-in-out infinite",
        "streak-pop": "streak-pop .5s cubic-bezier(.16,1,.3,1) both",
        confetti: "confetti 2.8s cubic-bezier(.2,.7,.4,1) both",
      },
    },
  },
  plugins: [],
};
