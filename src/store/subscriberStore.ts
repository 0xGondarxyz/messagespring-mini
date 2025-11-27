import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Subscriber } from "../types/subscriber";

interface SubscriberStore {
  subscribers: Subscriber[];
  addSubscriber: (username: string) => Subscriber;
  removeSubscriber: (id: string) => void;
  updateSubscriber: (id: string, updates: Partial<Subscriber>) => void;
}

export const useSubscriberStore = create<SubscriberStore>()(
  persist(
    (set) => ({
      subscribers: [],

      addSubscriber: (username: string) => {
        const newSubscriber: Subscriber = {
          id: crypto.randomUUID(),
          username: username.startsWith("@") ? username : `@${username}`,
          subscribedAt: new Date(),
        };

        set((state) => ({
          subscribers: [...state.subscribers, newSubscriber],
        }));

        return newSubscriber;
      },

      removeSubscriber: (id: string) =>
        set((state) => ({
          subscribers: state.subscribers.filter((sub) => sub.id !== id),
        })),

      updateSubscriber: (id: string, updates: Partial<Subscriber>) =>
        set((state) => ({
          subscribers: state.subscribers.map((sub) =>
            sub.id === id ? { ...sub, ...updates } : sub
          ),
        })),
    }),
    {
      name: "subscriber-storage", // localStorage key
    }
  )
);
