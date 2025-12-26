import { GoogleGenAI } from "@google/genai";

// FIX: Initialize with process.env.API_KEY directly and remove manual checks, per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateVideoPrompt(
  mainImageBase64: string,
  additionalImagesBase64: string[]
): Promise<string> {
  try {
    const model = 'gemini-3-pro-preview';

    const systemInstruction = `You are an expert video prompt creator specializing in psychedelic and surreal art. You create detailed and imaginative video prompts ready to be used in a text-to-video generation model. Output only the prompt text itself, without any introductory phrases like "Here is your prompt:".`;
    
    // This prompt is now more generic to handle one or more images.
    const userPrompt = `Analyze the provided collection of one or more images. Synthesize the styles, subjects, colors, and moods from all images to create a single, cohesive, and imaginative video prompt.

Describe the following in your prompt:
1.  **Scene:** The overall environment, which should be constantly shifting and morphing, incorporating elements from all images.
2.  **Character(s):** Describe any figures, their appearance, expression, and actions, blending characteristics from the source images if applicable.
3.  **Animation Style:** Describe the visual effects, color palette, and movement. Mention things like melting backgrounds, pulsating colors, and swirling patterns, drawing inspiration from the provided art.
4.  **Mood:** The feeling the video should evoke (e.g., euphoric, confusing, energetic, nightmarish), based on the combined atmosphere of the images.
5.  **Camera Work:** Suggest camera movements like fast zooms, rotating shots, or perspective shifts that would enhance the dynamic nature of the scene.`;

    const imageParts = [
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: mainImageBase64,
        },
      },
      ...additionalImagesBase64.map(data => ({
        inlineData: {
          mimeType: 'image/jpeg',
          data: data,
        },
      })),
    ];

    const response = await ai.models.generateContent({
        model: model,
        contents: { parts: [{ text: userPrompt }, ...imageParts] },
        config: {
          systemInstruction: systemInstruction,
        }
    });
    
    if (response.text) {
        return response.text;
    } else {
        throw new Error("The API returned an empty response.");
    }
    // FIX: Corrected the catch block syntax from `catch (error).` to `catch (error) {`.
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate prompt: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
  }
}
