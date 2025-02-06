/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        extend: {
            boxShadow: {
                normal: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                medium: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                large: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            },
            colors: {
                white: "#ffffff",
                light: "#f1f5f9",
                black: "#121212",
                night: "#001632",
                red: "#f44336",
                blue: "#1a73e8",
                gray: "#80868b",
                grayish: "#dadce0",
            },
        },
    },
    plugins: [],
}
