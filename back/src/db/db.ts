import mysql from "mysql2/promise";
import { FAQ } from "../models/faq";
let db: mysql.Connection;

export async function getDB() {
  if (!db) {
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
  }
  return db;
}

export async function getFAQs(): Promise<FAQ[]> {
  const db = await getDB();
  const [rows]: any = await db.execute("SELECT * FROM faqs");

  return (rows as any[]).map(row => ({
    id: row.id,
    question: row.question,
    answer: row.answer,
    embedding: row.embedding,
  }));
}