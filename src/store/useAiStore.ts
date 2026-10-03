import { create } from "zustand";
import { checkAiHealth, warmupAi } from "../services/aiService";

interface AiState {
  isOnline: boolean;
  model: string;
  isWarmedUp: boolean;
  isChecking: boolean;
  checkHealthAndWarmup: () => Promise<void>;
}

export const useAiStore = create<AiState>((set, get) => ({
  isOnline: false,
  model: "qwen2.5:7b",
  isWarmedUp: false,
  isChecking: true,

  checkHealthAndWarmup: async () => {
    try {
      set({ isChecking: true });
      const health = await checkAiHealth();
      set({
        isOnline: health.online,
        model: health.model || "qwen2.5:7b",
        isChecking: false,
      });

      // If online and not yet warmed up, send 1-token warm-up in background
      if (health.online && !get().isWarmedUp) {
        warmupAi().then(() => {
          set({ isWarmedUp: true });
        });
      }
    } catch {
      set({ isOnline: false, isChecking: false });
    }
  },
}));
