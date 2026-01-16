import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";
import { RECEIPT_JSON_SCHEMA } from "../modules/receipt.schema.js";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("❌ OPENAI_API_KEY is missing in .env");
}

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const extractReceiptJson = async (imageBase64) => {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: RECEIPT_JSON_SCHEMA },
      {
        role: "user",
        content: [
          { type: "text", text: "Extract receipt data into JSON." },
          {
            type: "image_url",
            image_url: { url: `data:image/jpeg;base64,${imageBase64}` }
          }
        ]
      }
    ],
    temperature: 0
  });

  const content = response.choices?.[0]?.message?.content;

  if (!content) return { receipts: [] };

  try {
    return JSON.parse(content);
  } catch {
    throw new Error("OpenAI returned invalid JSON");
  }
};
