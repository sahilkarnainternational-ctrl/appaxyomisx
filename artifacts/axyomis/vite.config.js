import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    return {
        plugins: [react()],
        define: {
            "process.env.GEMINI_API_KEY": JSON.stringify(env.GEMINI_API_KEY),
        },
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "src"),
                "@assets": path.resolve(__dirname, "../../attached_assets"),
            },
        },
        build: {
            outDir: path.resolve(__dirname, "dist/public"),
            emptyOutDir: true,
            sourcemap: false,
            rollupOptions: {
                output: {
                    manualChunks: {
                        vendor: ["react", "react-dom"],
                        firebase: ["firebase/app", "firebase/auth", "firebase/firestore"],
                    },
                },
            },
        },
        server: {
            port: 3000,
            strictPort: true,
            host: "0.0.0.0",
        },
        preview: {
            port: 3000,
            host: "0.0.0.0",
        },
    };
});
