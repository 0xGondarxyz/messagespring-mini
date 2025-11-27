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

let lastUpdateId = 0;

export async function getNewSubscribers(): Promise<
  { chatId: string; username: string }[]
> {
  console.log("🔍 Fetching updates from Telegram...");
  console.log("Bot Token exists:", !!BOT_TOKEN);
  console.log("Last Update ID:", lastUpdateId);

  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=${
      lastUpdateId + 1
    }&timeout=0`;
    console.log("API URL:", url.replace(BOT_TOKEN, "HIDDEN_TOKEN"));

    const response = await fetch(url);
    const data: TelegramResponse = await response.json();

    console.log("✅ Telegram API Response:", data);

    if (!data.ok) {
      console.error("❌ Telegram API error:", data);
      return [];
    }

    const newSubscribers: { chatId: string; username: string }[] = [];

    for (const update of data.result) {
      console.log("📩 Processing update:", update);

      if (update.message?.text === "/start") {
        const chatId = update.message.chat.id.toString();
        const username =
          update.message.chat.username ||
          update.message.chat.first_name ||
          `user_${chatId}`;

        console.log("✅ Found new subscriber:", { chatId, username });
        newSubscribers.push({ chatId, username });
      }

      if (update.update_id > lastUpdateId) {
        lastUpdateId = update.update_id;
      }
    }

    console.log("📊 Total new subscribers found:", newSubscribers.length);
    return newSubscribers;
  } catch (error) {
    console.error("❌ Error fetching Telegram updates:", error);
    return [];
  }
}
