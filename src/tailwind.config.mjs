/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', './public/**/*.html'],
    theme: {
        extend: {
            fontSize: {
                xs: ["0.75rem", { lineHeight: "1.25", letterSpacing: "0.02em", fontWeight: "400" }],
                sm: ["0.875rem", { lineHeight: "1.35", letterSpacing: "0.02em", fontWeight: "400" }],
                base: ["1rem", { lineHeight: "1.5", letterSpacing: "0.025em", fontWeight: "400" }],
                lg: ["1.125rem", { lineHeight: "1.5", letterSpacing: "0.025em", fontWeight: "400" }],
                xl: ["1.25rem", { lineHeight: "1.5", letterSpacing: "0.02em", fontWeight: "600" }],
                "2xl": ["1.5rem", { lineHeight: "1.4", letterSpacing: "0.015em", fontWeight: "600" }],
                "3xl": ["1.875rem", { lineHeight: "1.3", letterSpacing: "0em", fontWeight: "700" }],
                "4xl": ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "700" }],
                "5xl": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.015em", fontWeight: "700" }],
                "6xl": ["3.75rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "800" }],
                "7xl": ["4.5rem", { lineHeight: "1.05", letterSpacing: "-0.025em", fontWeight: "800" }],
                "8xl": ["6rem", { lineHeight: "1", letterSpacing: "-0.03em", fontWeight: "900" }],
                "9xl": ["8rem", { lineHeight: "1", letterSpacing: "-0.035em", fontWeight: "900" }],
            },
            fontFamily: {
                heading: ["bitter"],
                paragraph: ["madefor-display"]
            },
            colors: {
                primary: "#E85D3F",
                "primary-foreground": "#FFFFFF",
                secondary: "#1A1A1A",
                "secondary-foreground": "#FFFFFF",
                background: "#FFFFFF",
                destructive: "#E85D3F",
                "destructive-foreground": "#FFFFFF",
                "accent-orange": "#E85D3F",
                "deep-black": "#1A1A1A",
                "light-grey": "#F5F5F5",
                "medium-grey": "#E0E0E0",
                foreground: "#1A1A1A",
                darktext: "#1A1A1A",
                contentblockbackground: "#F5F5F5",
                buttonborder: "#E85D3F"
            },
        },
    },
    future: {
        hoverOnlyWhenSupported: true,
    },
    plugins: [require('@tailwindcss/container-queries'), require('@tailwindcss/typography')],
}
