// src/routes/aiRoutes.ts
import { conversationService } from "../services/conversationService.js";
import { askGemini } from "../services/geminiService.js";
import { Router } from "express";

const router = Router();

router.post("/trip", async (req: any, res: any) => {
  try {
    const { sessionId, userMessage } = req.body;

    if (!sessionId || !userMessage) {
      return res.status(400).json({ error: "sessionId and userMessage required" });
    }

    // fetch conversation state from DB
    let conv = await conversationService.get(sessionId);

    // build history (optional, can store in conv.data if needed)
    const history = conv.data.history || [];

    // call Gemini
    const aiResponse = await askGemini(userMessage, history);

    // update DB with new step + history
    await conversationService.update(sessionId, {
      step: aiResponse.ui,
      data: { ...conv.data, history: [...history, `User: ${userMessage}`, `AI: ${aiResponse.resp}`] },
    });

    res.json(aiResponse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
