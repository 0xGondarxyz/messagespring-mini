const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;

export interface TelegramUpdate {
  update_id: number;
  message?: {
    chat: {
      id: number;
      username?: string;
      first_name?: string;
    };
    text?: string;
    date: number;
  };
}

export interface TelegramResponse {
  ok: boolean;
  result: TelegramUpdate[];
}

export async function getNewSubscribers(): Promise<
  { chatId: string; username: string }[]
> {
  console.log("🔍 Fetching updates from Telegram...");
  console.log("Bot Token exists:", !!BOT_TOKEN);

  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`;
    const response = await fetch(url);
    const data: TelegramResponse = await response.json();
    console.log("✅ Telegram API Response:", data);
    return data.result
      .filter((update) => update.message?.chat?.id) // Filter out updates without chat id
      .map((update) => ({
        chatId: update.message!.chat.id.toString(),
        username:
          update.message!.chat.username ||
          update.message!.chat.first_name ||
          "unknown",
      }));
  } catch (error) {
    console.error("❌ Error fetching Telegram updates:", error);
    return [];
  }
}
