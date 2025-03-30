import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import { WebSocketServer } from "ws";
import { findMostSimilarFaq } from "./functions/functions";

dotenv.config();

const wss = new WebSocketServer({ port: 5000 });
const app = express();
const PORT = process.env.PORT || 3000;

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

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});