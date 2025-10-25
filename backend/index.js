// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  transcribeAudio,
  describeVideoVisuals,
  generateCaptions,
} from "./functions.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "1000mb", extended: true }));

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.json({ message: "Server is running ✅" });
});

app.post("/transcribeAudio", async (req, res) => {
  const { base64Frame } = req.body;
  try {
    const reply = await transcribeAudio(base64Frame);
    res.json({ success: true, data: reply });
  } catch (err) {
    res.json({ success: false, data: err.message });
  }
});

app.post("/describeVideoVisuals", async (req, res) => {
  const { base64Frames } = req.body;
  try {
    const reply = await describeVideoVisuals(base64Frames);
    res.json({ success: true, data: reply });
  } catch (err) {
    res.json({ success: false, data: err.message });
  }
});

app.post("/generateCaptions", async (req, res) => {
  const { transcript, style, language } = req.body;
  try {
    const reply = await generateCaptions(transcript, style, language);
    res.json({ success: true, data: reply });
  } catch (err) {
    res.json({ success: false, data: err.message });
  }
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
