import { create } from "zustand";
import type { Subscriber } from "../types/subscriber";

interface SubscriberStore {
  subscribers: Subscriber[];
  addSubscriber: (username: string) => Subscriber; // Returns the created subscriber
  removeSubscriber: (id: string) => void;
  updateSubscriber: (id: string, updates: Partial<Subscriber>) => void;
}

export const useSubscriberStore = create<SubscriberStore>((set) => ({
  subscribers: [],

  addSubscriber: (username: string) => {
    const newSubscriber: Subscriber = {
      id: crypto.randomUUID(), // Browser's built-in UUID generator
      username: username.startsWith("@") ? username : `@${username}`,
      subscribedAt: new Date(),
    };

    set((state) => ({
      subscribers: [...state.subscribers, newSubscriber],
    }));

    return newSubscriber; // Return it in case you need the ID
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
}));
