import express, {Request, Response} from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import { WebSocketServer } from "ws";
import { findMostSimilarFaq } from "./functions/functions";
import fs from "fs";
import multer from "multer";
import OpenAI from "openai";
import { Transcription } from "openai/resources/audio/transcriptions";
import path from "path";
const http = require('http');

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const PORT = process.env.PORT || 3000;

const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}


const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, `${uploadDir}/`);
  },
  filename: (_req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})


app.use(express.json());
app.use(cors());
app.use(bodyParser.json());



wss.on("connection", (ws) => {
    console.log("Client connected");
  
    ws.on("message", async (data) => {
      const text = data.toString();
      const botreply: any = await findMostSimilarFaq(text);
  
        ws.send(botreply);
  
    });
  
    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });


app.post("/transcribe", upload.single("file"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    const audioPath = req.file.path;

    const response: Transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: "whisper-1",
    });

    const botReply: any = await findMostSimilarFaq(response.text);

    res.json({ text: botReply, transcription: response });

    fs.unlinkSync(audioPath);
  } catch (error) {
    console.error("Error during transcription:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Internal Server Error" });
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
