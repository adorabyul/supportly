import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import OpenAI from "openai";
import { WebSocketServer } from "ws";

dotenv.config();

const wss = new WebSocketServer({ port: 8080 });
const app = express();
const PORT = process.env.PORT || 3000;
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
  
       const aiResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `
              You are a professional customer support assistant for Supportly.
              Your goal is to assist users in a helpful, friendly, and professional manner.
              Always provide clear, accurate, and polite responses.
              If the question is unrelated to customer support, politely redirect the user.
            `,
          },
          { role: "user", content: text },
        ],
      });
  
      const botReply = aiResponse.choices[0]?.message?.content || "I'm here to help! How can I assist you today?";

      ws.send(botReply);
    });
  
    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});