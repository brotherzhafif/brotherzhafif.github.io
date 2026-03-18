module.exports = {
    content: [
        "./index.html",
        "./asset/script.js",
        "./asset/style.css"
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                background: "#11121a",
                surface: "#1f202b",
                neutral: {
                    400: "#b0b3c7",
                    50: "#f6f7fb"
                }
            },
            fontFamily: {
                mono: ["Fira Mono", "Menlo", "Monaco", "Consolas", "monospace"]
            }
        }
    },
    plugins: []
};
