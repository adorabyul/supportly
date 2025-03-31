import OpenAI from "openai";
import { getFAQs } from "../db/db";
import { FAQ } from "../models/faq";
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

async function getEmbedding(question: string) {
    try {
      const response = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: question,
      });
      
      return response.data[0].embedding;
    } catch (error) {
      console.error("Error getting embedding:", error);
      return null;
    }
  }
  
function cosineSimilarity(vec1: number[], vec2: number[]): number {
    const dotProduct = vec1.reduce((acc, val, i) => acc + val * vec2[i], 0);
    const norm1 = Math.sqrt(vec1.reduce((acc, val) => acc + val * val, 0));
    const norm2 = Math.sqrt(vec2.reduce((acc, val) => acc + val * val, 0));
    
    return dotProduct / (norm1 * norm2);
}

async function getChatGptResponse(question: string): Promise<string | null> {
  
    const response = await openai.chat.completions.create({
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
        { role: "user", content: question },
      ],
    });
  
    return response.choices[0].message.content;
}
  
export async function findMostSimilarFaq(question: string): Promise<string | null> {
    const userEmbedding = await getEmbedding(question);
    
    if (!userEmbedding) {
      return "Sorry, I couldn't understand your question.";
    }
  
    const faqs: FAQ[] = await getFAQs();
  
    let mostSimilarFaq: any;
    let highestSimilarity = -Infinity;
  
    faqs.forEach((faq: FAQ) => {
      const similarity = cosineSimilarity(userEmbedding, faq.embedding);
      if (similarity > highestSimilarity) {
        highestSimilarity = similarity;
        mostSimilarFaq = faq;
      }
});
  
  
const similarityThreshold = 0.8; 
    if (highestSimilarity >= similarityThreshold && mostSimilarFaq) {
      return mostSimilarFaq.answer;
    }
  
    return await getChatGptResponse(question);
}
 