import { env } from "../config/env.js";
import {
  MASTER_PROMPT_SYSTEM,
  buildWebsiteUpdateMessage,
  buildWebsiteUserMessage,
} from "../constants/masterPrompt.js";

const url = "https://openrouter.ai/api/v1/chat/completions";

export const generateWebsite = async (prompt: string) => {
  console.log("Generating website...");
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: MASTER_PROMPT_SYSTEM,
        },
        {
          role: "user",
          content: buildWebsiteUserMessage(prompt),
        },
      ],
    }),
  });
    console.log("Response received...");
    const data = await response.json();
    console.log("Data received...");
    return data.choices[0].message.content;
}
export const generateWebsiteUpdate = async (currentCode: string, userMessage: string) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL,
      messages: [
        { role: "system", content: MASTER_PROMPT_SYSTEM },
        { role: "user", content: buildWebsiteUpdateMessage(currentCode, userMessage) },
      ],
    }),
  });
  const data = await response.json();
  return data.choices[0].message.content;
};