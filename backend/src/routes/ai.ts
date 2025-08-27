import { Router } from "express";
import { getTripResponse } from "../services/geminiService.js";
import { conversationStore } from "../conversationStore";

const router = Router();

router.post("/api/ai", async (req, res) => {
  try {
    const { message, sessionId = "default" } = req.body; // frontend must send sessionId

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Get previous history
    const history = conversationStore.get(sessionId);

    // Ask Gemini
    const aiResponse = await getTripResponse(message, history);

    // Save both user + AI turns
    conversationStore.add(sessionId, "User", message);
    conversationStore.add(sessionId, "AI", aiResponse.resp);

    res.json(aiResponse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI error" });
  }
});

router.post("/api/ai/reset", (req, res) => {
  try {
    const { sessionId = "default" } = req.body;

    conversationStore.reset(sessionId);

    res.json({
      message: `Conversation reset successfully for session: ${sessionId}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not reset session" });
  }
});

export default router;
