//  @type{import('tailwindcss').config}

import plugin from "eslint-plugin-react-hooks";

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}", //Scan All jsx files
    ],
    theme: {
        extend: {},

    },
    plugins: [],
}