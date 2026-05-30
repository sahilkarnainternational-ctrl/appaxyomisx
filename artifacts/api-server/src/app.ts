const express = require("express");
const cors = require("cors");
const chatRoutes = require("./routes/chat");
const youtubeRoutes = require("./routes/youtube");

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.use("/api/chat", chatRoutes);
app.use("/api", youtubeRoutes);

module.exports = app;
