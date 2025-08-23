// src/routes/aiRoutes.ts
import { Router } from "express";
import { askGemini } from "../services/geminiService.js";

const router = Router();

// POST /api/ai/ask
router.post("/ask", async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const response = await askGemini(message, history || []);
  res.json(response);
});

export default router;
