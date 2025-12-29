
import { GoogleGenAI } from "@google/genai";

export const generateMoodImages = async (moodPrompt: string, count: number = 4): Promise<string[]> => {
  // Always use process.env.API_KEY directly when initializing the GoogleGenAI client instance.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const imageUrls: string[] = [];

  // Note: For a real production app, we might parallelize these or handle batches.
  // Here we loop to get unique variations.
  for (let i = 0; i < count; i++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { text: `${moodPrompt}. Variation ${i + 1}. High resolution cinematic photography.` }
          ]
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9"
          }
        }
      });

      // Iterate through all parts to find the image part, do not assume it is the first part.
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            imageUrls.push(`data:image/png;base64,${part.inlineData.data}`);
            break;
          }
        }
      }
    } catch (error) {
      console.error("Error generating image:", error);
      // Fallback to placeholder if API fails
      imageUrls.push(`https://picsum.photos/1920/1080?random=${Math.random()}`);
    }
  }

  return imageUrls;
};
