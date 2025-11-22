/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#1e40af', // Custom primary color
                secondary: '#1e293b', // Custom secondary color
            }
        },
    },
    plugins: [],
}
