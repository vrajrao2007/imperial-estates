/**
 * Zustand store for saved properties and compare list.
 * Persists to localStorage automatically.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PropertyStore {
  savedIds: string[];
  compareIds: string[];

  toggleSaved: (id: string) => void;
  isSaved: (id: string) => boolean;
  clearSaved: () => void;

  toggleCompare: (id: string) => void;
  isInCompare: (id: string) => boolean;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;

  /** Dark mode preference */
  isDark: boolean;
  toggleTheme: () => void;
}

export const usePropertyStore = create<PropertyStore>()(
  persist(
    (set, get) => ({
      savedIds: [],
      compareIds: [],
      isDark: false,

      toggleSaved: (id) =>
        set((s) => ({
          savedIds: s.savedIds.includes(id)
            ? s.savedIds.filter((x) => x !== id)
            : [...s.savedIds, id],
        })),

      isSaved: (id) => get().savedIds.includes(id),

      clearSaved: () => set({ savedIds: [] }),

      toggleCompare: (id) =>
        set((s) => {
          if (s.compareIds.includes(id)) {
            return { compareIds: s.compareIds.filter((x) => x !== id) };
          }
          // Cap at 3 properties
          if (s.compareIds.length >= 3) return s;
          return { compareIds: [...s.compareIds, id] };
        }),

      isInCompare: (id) => get().compareIds.includes(id),

      removeFromCompare: (id) =>
        set((s) => ({ compareIds: s.compareIds.filter((x) => x !== id) })),

      clearCompare: () => set({ compareIds: [] }),

      toggleTheme: () =>
        set((s) => {
          const next = !s.isDark;
          // Apply/remove class on <html>
          document.documentElement.classList.toggle("dark", next);
          return { isDark: next };
        }),
    }),
    {
      name: "estate-storage",
      // Rehydrate dark mode class on load
      onRehydrateStorage: () => (state) => {
        if (state?.isDark) {
          document.documentElement.classList.add("dark");
        }
      },
    }
  )
);
