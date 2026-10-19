import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        error: "Method not allowed"
      });
    }

    const { type, text, prompt } = req.body || {};

    // =========================
    // AI VOICE
    // =========================

    if (type === "voice") {
      if (!text || !text.trim()) {
        return res.status(400).json({
          error: "বাংলা script দিন"
        });
      }

      const speech = await client.audio.speech.create({
        model: "gpt-4o-mini-tts",
        voice: "alloy",
        input: text.trim(),
        response_format: "mp3"
      });

      const buffer = Buffer.from(
        await speech.arrayBuffer()
      );

      res.setHeader(
        "Content-Type",
        "audio/mpeg"
      );

      res.setHeader(
        "Content-Disposition",
        'inline; filename="ai-voice.mp3"'
      );

      return res.status(200).send(buffer);
    }

    // =========================
    // AI IMAGE
    // =========================

    if (type === "image") {
      if (!prompt || !prompt.trim()) {
        return res.status(400).json({
          error: "Image prompt দিন"
        });
      }

      const result = await client.images.generate({
        model: "gpt-image-1",
        prompt: prompt.trim(),
        size: "1024x1024"
      });

      const imageBase64 =
        result.data?.[0]?.b64_json;

      if (!imageBase64) {
        return res.status(500).json({
          error: "Image তৈরি করা যায়নি"
        });
      }

      return res.status(200).json({
        image:
          "data:image/png;base64," +
          imageBase64
      });
    }

    return res.status(400).json({
      error: "Unknown request type"
    });

  } catch (error) {

    console.error(
      "OpenAI API Error:",
      error
    );

    return res.status(500).json({
      error:
        error?.message ||
        "Server error"
    });
  }
      }
