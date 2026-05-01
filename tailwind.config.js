/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,ts}"],
    darkMode: "class",

    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",

                card: {
                    DEFAULT: "var(--card)",
                    foreground: "var(--card-foreground)",
                },

                primary: {
                    DEFAULT: "var(--primary)",
                    foreground: "var(--primary-foreground)",
                },

                accent: "var(--accent)",

                muted: {
                    DEFAULT: "var(--muted)",
                    foreground: "var(--muted-foreground)",
                },

                border: "var(--border)",
            }
        },
    },

    plugins: [],
};