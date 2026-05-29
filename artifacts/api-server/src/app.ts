import express from \"express\";
import cors from \"cors\";
import chatRoutes from \"./routes/chat\";
import youtubeRoutes from \"./routes/youtube\";

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.use(\"/api\", chatRoutes);
app.use(\"/api\", youtubeRoutes);

export default app;
