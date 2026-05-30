"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const plugin_react_1 = __importDefault(require("@vitejs/plugin-react"));
const vite_2 = __importDefault(require("@tailwindcss/vite"));
const path_1 = __importDefault(require("path"));
const url_1 = require("url");
const __dirname = path_1.default.dirname((0, url_1.fileURLToPath)(import.meta.url));
exports.default = (0, vite_1.defineConfig)(({ mode }) => {
    const env = (0, vite_1.loadEnv)(mode, path_1.default.resolve(__dirname, "artifacts/axyomis"), "");
    return {
        base: "/",
        plugins: [(0, plugin_react_1.default)(), (0, vite_2.default)()],
        define: {
            "process.env.GEMINI_API_KEY": JSON.stringify(env.GEMINI_API_KEY || ""),
        },
        resolve: {
            alias: {
                "@": path_1.default.resolve(__dirname, "artifacts/axyomis/src"),
                "@assets": path_1.default.resolve(__dirname, "attached_assets"),
            },
            dedupe: ["react", "react-dom"],
        },
        build: {
            outDir: path_1.default.resolve(__dirname, "artifacts/axyomis/dist/public"),
            emptyOutDir: true,
            sourcemap: false,
            rollupOptions: {
                output: {
                    manualChunks: {
                        vendor: ["react", "react-dom"],
                        firebase: ["firebase/app", "firebase/auth", "firebase/firestore"],
                        charts: ["recharts"],
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
