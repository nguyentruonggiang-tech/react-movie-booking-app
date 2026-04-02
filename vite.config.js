import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import * as path from "path";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@pages": path.resolve(__dirname, "./src/pages"),
            "@services": path.resolve(__dirname, "./src/services"),
            "@components": path.resolve(__dirname, "./src/components"),
            "@routes": path.resolve(__dirname, "./src/routes"),
            "@constants": path.resolve(__dirname, "./src/constants")
        },
    },
});
