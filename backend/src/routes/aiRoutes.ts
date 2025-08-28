// src/routes/aiRoutes.ts
import { conversationService } from "../services/conversationService.js";
import { askGemini } from "../services/geminiService.js";
import { Router } from "express";

const router = Router();

// POST /api/ai/ask
// router.post("/ask", async (req: any, res: any) => {
//   const { message, history } = req.body;

//   if (!message) {
//     return res.status(400).json({ error: "Message is required" });
//   }

//   const response = await askGemini(message, history || []);
//   res.json(response);
// });

router.post("/trip", async (req : any, res: any) => {
  try {
    const { sessionId, userMessage } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "sessionId required" });
    }

    // fetch conversation state from DB
    let conv = await conversationService.get(sessionId);

    // AI logic here (use conv.step + conv.data)
    // Example mock response:
    let response = {
      resp: "Great! First, where are you starting your trip from?",
      ui: "source",
    };

    // update DB with new step
    await conversationService.update(sessionId, {
      step: "destination", // example next step
      data: { ...conv.data, source: userMessage || "" },
    });

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
