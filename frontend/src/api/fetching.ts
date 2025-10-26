// functions.ts
import { CaptionStyle } from "../../types.ts";
import BackendURL from "../url.js";

console.log(BackendURL);

const getStyleGuide = (style: CaptionStyle): string => {
  switch (style) {
    case CaptionStyle.Meme:
      return "Use popular internet slang, humor, and punchy, short sentences. Think viral TikTok or Instagram Reels captions. Add relevant emojis.";
    case CaptionStyle.Formal:
      return "Use professional, grammatically correct language suitable for educational or corporate content. Avoid slang and contractions.";
    case CaptionStyle.Casual:
      return "Use a friendly, conversational tone. Use contractions and everyday language. Add some light-hearted emojis where appropriate.";
    case CaptionStyle.Aesthetic:
      return "Use poetic, evocative, and visually descriptive language. Focus on creating a mood. Often uses lowercase letters and minimal punctuation.";
    default:
      return "Generate a standard, clear caption.";
  }
};

export const transcribeAudio = async (base64Frame: string): Promise<string> => {
  try {
    const dataToSend = { base64Frame };
    const res = await fetch(`${BackendURL}/transcribeAudio`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });
    const response = await res.json();
    if (response.success) return response.data;
    return `There was an error: ${response.data}`;
  } catch (error) {
    console.error("Error generating audio transcript:", error);
    throw new Error(`Failed to generate audio transcript: ${(error as Error).message}`);
  }
};

export const describeVideoVisuals = async (base64Frames: string[]): Promise<string> => {
  try {
    const dataToSend = { base64Frames };
    const res = await fetch(`${BackendURL}/describeVideoVisuals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });
    const response = await res.json();
    if (response.success) return response.data;
    return `There was an error: ${response.data}`;
  } catch (error) {
    console.error("Error generating visual description:", error);
    throw new Error(`Failed to generate visual description: ${(error as Error).message}`);
  }
};

export const generateCaptions = async (
  transcript: string,
  style: CaptionStyle,
  language: string
): Promise<string> => {
  try {
    const dataToSend = {
      transcript,
      style,
      language,
      styleGuide: getStyleGuide(style),
    };
    const res = await fetch(`${BackendURL}/generateCaptions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });
    const response = await res.json();
    if (response.success) return response.data;
    return `There was an error: ${response.data}`;
  } catch (error) {
    console.error("Error generating captions:", error);
    throw new Error(`Failed to generate captions: ${(error as Error).message}`);
  }
};