import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "./prompt";
import { DATA_GENERATION_SYSTEM_PROMPT } from "./runtimeDataPrompt";

import { cookies } from "next/headers";

async function getGeminiClient() {
  const cookieStore = await cookies();
  const userKey = cookieStore.get("gemini_api_key")?.value;
  const apiKey = userKey || process.env.GOOGLE_API_KEY!;
  
  return new GoogleGenAI({ apiKey });
}

export async function callGemini(input: string): Promise<string> {
  const ai = await getGeminiClient();
  const res = await ai.models.generateContent({
    model: "gemini-2.5-flash", 
    contents: [
      {
        role: "user",
        parts: [{ text: input }],
      },
    ],
    config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.2, 
    }
  });

  if (!res.text) {
    throw new Error("Gemini response text is undefined");
  }
  return res.text; 
}

export async function callGeminiForData(promptContext: string, config: any, page: any): Promise<any> {
  const ai = await getGeminiClient();
  const inputPayload = JSON.stringify({ appIdeaOrPrompt: promptContext, appConfig: config, page: page }, null, 2);
  
  const res = await ai.models.generateContent({
    model: "gemini-2.5-flash", 
    contents: [
      {
        role: "user",
        parts: [{ text: inputPayload }],
      },
    ],
    config: {
        systemInstruction: DATA_GENERATION_SYSTEM_PROMPT,
        temperature: 0.7, 
        responseMimeType: "application/json",
    }
  });
  console.log(res.text);

  try {
    const rawText = res.text || "{}";
    const parsed = JSON.parse(rawText);
    return parsed;
  } catch (err) {
    console.error("Failed to parse Gemini data output:", err);
    return page.type === 'table' ? [] : {};
  }
}