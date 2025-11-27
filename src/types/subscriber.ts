export interface Subscriber {
  id: string; // Unique identifier YOU control
  chatId?: string; // Telegram-specific (optional for now)
  username?: string;
  subscribedAt: Date; // Useful for analytics
}
