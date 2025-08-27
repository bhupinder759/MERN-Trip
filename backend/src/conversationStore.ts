type Step =
  | "source"
  | "destination"
  | "groupSize"
  | "budget"
  | "tripDuration"
  | "interests"
  | "preferences"
  | "final";

interface ConversationState {
  step: Step;
  data: Record<string, any>;
  lastActive: number;
}

class ConversationStore {
  private store: Map<string, ConversationState> = new Map();
  private EXPIRY_TIME = 30 * 60 * 1000; // 30 minutes in ms

  constructor() {
    // Run cleanup every 10 minutes
    setInterval(() => this.cleanupExpiredSessions(), 10 * 60 * 1000);
  }

  private createFreshState(): ConversationState {
    return { step: "source", data: {}, lastActive: Date.now() };
  }

  get(sessionId: string): ConversationState {
    const state = this.store.get(sessionId);

    if (!state || Date.now() - state.lastActive > this.EXPIRY_TIME) {
      const fresh = this.createFreshState();
      this.store.set(sessionId, fresh);
      return fresh;
    }

    return state;
  }

  update(sessionId: string, data: Partial<ConversationState>) {
    const current = this.get(sessionId);
    const updated = { ...current, ...data, lastActive: Date.now() };
    this.store.set(sessionId, updated);
  }

  reset(sessionId: string) {
    this.store.set(sessionId, this.createFreshState());
  }

  private cleanupExpiredSessions() {
    const now = Date.now();
    for (const [sessionId, state] of this.store.entries()) {
      if (now - state.lastActive > this.EXPIRY_TIME) {
        this.store.delete(sessionId);
        console.log(`🧹 Cleaned up expired session: ${sessionId}`);
      }
    }
  }
}

export const conversationStore = new ConversationStore();
