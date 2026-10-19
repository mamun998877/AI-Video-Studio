import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "My AI Server is running"
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { prompt } = req.body || {};

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        error: "Prompt দিন"
      });
    }

    const response = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gemma3:1b",
        prompt: prompt.trim(),
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();

      return res.status(500).json({
        error: "AI model error",
        details: errorText
      });
    }

    const data = await response.json();

    return res.status(200).json({
      reply: data.response || ""
    });

  } catch (error) {
    console.error("AI Server Error:", error);

    return res.status(500).json({
      error: error.message || "AI server error"
    });
  }
});

app.listen(PORT, () => {
  console.log(`My AI Server running on port ${PORT}`);
});
