/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                "primary": "#256af4",
                "primary-dark": "#1a4bb0",
                "accent-pink": "#f4256a",
                "accent-green": "#00d68f",
                "accent-purple": "#8c4fff",
                "accent-orange": "#ff6b00",
                "background-light": "#f5f6f8",
                "background-dark": "#101622",
                "surface-dark": "#1a2234",
                "surface-darker": "#151b2b",
            },
            fontFamily: {
                "display": ["Lexend", "sans-serif"],
                "sans": ["Lexend", "sans-serif"],
            },
        },
    },
    plugins: [],
}
