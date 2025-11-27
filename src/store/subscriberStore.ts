import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Subscriber } from "../types/subscriber";

interface SubscriberStore {
  subscribers: Subscriber[];
  removedSubscribers: Subscriber[]; // Track removed subscribers
  addSubscriber: (username: string, chatId: string) => Subscriber;
  removeSubscriber: (id: string) => void;
  updateSubscriber: (id: string, updates: Partial<Subscriber>) => void;
  isRemoved: (chatId: string) => boolean;
}

export const useSubscriberStore = create<SubscriberStore>()(
  persist(
    (set, get) => ({
      subscribers: [],
      removedSubscribers: [],
      addSubscriber: (username: string, chatId: string) => {
        const normalizedUsername = username.startsWith("@")
          ? username
          : `@${username}`;

        // Check if user is already subscribed
        const existingSubscriber = get().subscribers.find(
          (sub) =>
            sub.username.toLowerCase() === normalizedUsername.toLowerCase()
        );

        if (existingSubscriber) {
          return existingSubscriber; // Return existing subscriber instead of creating a new one
        }

        const newSubscriber: Subscriber = {
          id: crypto.randomUUID(),
          chatId: chatId,
          username: normalizedUsername,
          subscribedAt: new Date(),
        };

        set((state) => ({
          subscribers: [...state.subscribers, newSubscriber],
        }));

        return newSubscriber;
      },

      isRemoved: (chatId: string) => {
        return get().removedSubscribers.some((sub) => sub.chatId === chatId);
      },

      removeSubscriber: (id: string) =>
        set((state) => {
          const subscriberToRemove = state.subscribers.find(
            (sub) => sub.id === id
          );
          if (!subscriberToRemove) return state;

          return {
            subscribers: state.subscribers.filter((sub) => sub.id !== id),
            removedSubscribers: [
              ...state.removedSubscribers,
              subscriberToRemove,
            ],
          };
        }),

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
