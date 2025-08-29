import { Conversation, IConversation } from "../models/Conversation.js";

class ConversationService {
  async get(sessionId: string): Promise<IConversation> {
    let conv = await Conversation.findOne({ sessionId });

    if (!conv) {
      conv = new Conversation({
        sessionId,
        step: "source",
        data: {},
        lastActive: new Date(),
      });
      await conv.save();
    }

    return conv;
  }

  async update(sessionId: string, updates: Partial<IConversation>) {
    return Conversation.findOneAndUpdate(
      { sessionId },
      { ...updates, lastActive: new Date() },
      { new: true, upsert: true }
    );
  }

  async reset(sessionId: string) {
    return Conversation.findOneAndUpdate(
      { sessionId },
      { step: "source", data: {}, lastActive: new Date() },
      { new: true, upsert: true }
    );
  }
}

export const conversationService = new ConversationService();