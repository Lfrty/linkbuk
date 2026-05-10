/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,ts}"],
    darkMode: "class",

    theme: {
        extend: {
            keyframes: {
                'entrada-toad': {
                    '0%': { transform: 'translateY(-100%)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                }
            },
            animation: {
                'toad-slide': 'entrada-toad 0.4s ease-out'
            },
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