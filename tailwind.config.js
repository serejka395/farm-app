/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./App.tsx",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            'f2e-gold': '#FFC107',
            'f2e-black': '#0A0A0A',
            'f2e-dark': '#151515',
            'f2e-gray': '#2A2A2A',
            'solana-purple': '#9945FF',
            'solana-green': '#14F195',
            animation: {
                'spin-slow': 'spin 3s linear infinite',
                'bounce-subtle': 'bounce-subtle 3s infinite ease-in-out',
            },
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
