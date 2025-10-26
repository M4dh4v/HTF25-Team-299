import { GoogleGenAI, Type } from "@google/genai";
// Fix: Import CaptionStyle as a value because it is an enum used at runtime.
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable is not set.");
}

const CaptionStyle = {
  Meme: "Meme-style",
  Formal: "Formal",
  Casual: "Casual",
  Aesthetic: "Aesthetic",
};

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getStyleGuide = (style) => {
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

export const transcribeAudio = async (base64Frame) => {
  try {
    const prompt =
      "You are an expert speech-to-text transcription service. Based on this single representative frame from a video, generate a plausible, high-quality spoken transcript for the entire video. The transcript should sound natural as if spoken by a person. Output only the transcribed text, without any titles or introductory phrases.";

    const imagePart = {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64Frame,
      },
    };

    const contents = { parts: [{ text: prompt }, imagePart] };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating audio transcript:", error);
    let errorMessage = "Failed to generate audio transcript from the AI model.";
    if (error instanceof Error) {
      errorMessage += ` Details: ${error.message}`;
    }
    throw new Error(errorMessage);
  }
};

export const describeVideoVisuals = async (base64Frames) => {
  try {
    const prompt =
      "You are an expert video analyst. Based on this sequence of video frames, describe the key visual events, scenes, and actions happening in the video. Do not invent any dialogue or sounds. Focus only on what can be seen. The description should be a single block of text.";

    const imageParts = base64Frames.map((frame) => ({
      inlineData: {
        mimeType: "image/jpeg",
        data: frame,
      },
    }));

    const contents = { parts: [{ text: prompt }, ...imageParts] };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating visual description:", error);
    let errorMessage =
      "Failed to generate visual description from the AI model.";
    if (error instanceof Error) {
      errorMessage += ` Details: ${error.message}`;
    }
    throw new Error(errorMessage);
  }
};

export const generateCaptions = async (transcript, style, language) => {
  const styleGuide = getStyleGuide(style);
  const prompt = `You are an expert copywriter for social media. Your task is to write 4 to 5 different, brief, and engaging captions for a video. A caption is a title or brief explanation for the video.

**Instructions:**
1. Analyze the provided transcript to understand the video's content, tone, and key message.
2. Write 4 to 5 unique captions for the entire video.
3. Each caption should be in a ${style} style.
4. Each caption should have a catchy line, catchy title and 10 hashtags.
4. The output language must be ${language}.
5. The response must be a JSON array of strings, where each string is a caption.

**Style Guide for ${style}:**
${styleGuide}

**Transcript:**
"""
${transcript}
"""
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
            description: "A single, unique caption for the video.",
          },
        },
      },
    });

    const captions = JSON.parse(response.text);
    return captions;
  } catch (error) {
    console.error("Error generating captions:", error);
    let errorMessage = "Failed to generate captions from the AI model.";
    if (error instanceof Error) {
      errorMessage += ` Details: ${error.message}`;
    }
    throw new Error(errorMessage);
  }
};
