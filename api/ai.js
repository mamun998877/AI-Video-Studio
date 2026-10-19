import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        error: "Method not allowed"
      });
    }

    const { type, prompt } = req.body || {};

    // =========================
    // AI IMAGE
    // =========================

    if (type === "image") {
      if (!prompt || !prompt.trim()) {
        return res.status(400).json({
          error: "Image prompt দিন"
        });
      }

      const interaction = await ai.interactions.create({
        model: "gemini-nano-banana-2.1",
        input: prompt.trim(),
        response_format: {
          type: "image",
          mime_type: "image/png",
          aspect_ratio: "1:1"
        }
      });

      const image = interaction.output_image;

      if (!image) {
        return res.status(500).json({
          error: "Image তৈরি করা যায়নি"
        });
      }

      return res.status(200).json({
        image: "data:image/png;base64," + image.data
      });
    }

    return res.status(400).json({
      error: "Unknown request type"
    });

  } catch (error) {
    console.error("Gemini API Error:", error);

    return res.status(500).json({
      error: error?.message || "Server error"
    });
  }
}