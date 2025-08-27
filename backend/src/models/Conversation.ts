// models/Conversation.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IConversation extends Document {
  sessionId: string;
  step: string;
  data: Record<string, any>;
  lastActive: Date;
}

const ConversationSchema = new Schema<IConversation>({
  sessionId: { type: String, required: true, unique: true },
  step: { type: String, default: "source" },
  data: { type: Object, default: {} },
  lastActive: { type: Date, default: Date.now, index: true },
});

// TTL index -> expire documents after 30 minutes of inactivity
ConversationSchema.index({ lastActive: 1 }, { expireAfterSeconds: 1800 });

export const Conversation = mongoose.model<IConversation>(
  "Conversation",
  ConversationSchema
);
