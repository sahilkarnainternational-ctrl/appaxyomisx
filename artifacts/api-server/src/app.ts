import express from "express";
import cors from "cors";
import pino from "pino-http";
import { logger } from "./lib/logger";
import chatRoutes from "./routes/chat";
import youtubeRoutes from "./routes/youtube";
import emailRoutes from "./routes/email";
import healthRoutes from "./routes/health";

const app = express();

app.use(pino({ logger }));
app.use(cors({ origin: true }));
app.use(express.json());

app.use("/api/chat", chatRoutes);
app.use("/api", youtubeRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/health", healthRoutes);

export default app;
