import { useState } from "react";
import { useSubscriberStore } from "../store/subscriberStore";
import { getSubscribers } from "../services/telegramService";
import Modal from "./Modal";

export default function AdminPage() {
  const [isChecking, setIsChecking] = useState(false);
  const { subscribers, addSubscriber, removeSubscriber, updateSubscriber } =
    useSubscriberStore();

  const [message, setMessage] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [selectedChannels, setSelectedChannels] = useState({
    telegram: true,
    sms: false,
    email: false,
    line: false,
  });
  const [isSending, setIsSending] = useState(false);

  const languages = [
    { value: "english", label: "English" },
    { value: "french", label: "French" },
    { value: "thai", label: "Thai" },
    { value: "japanese", label: "Japanese" },
  ];

  const [modal, setModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "info";
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const handleChannelToggle = (channel: keyof typeof selectedChannels) => {
    setSelectedChannels((prev) => ({
      ...prev,
      [channel]: !prev[channel],
    }));
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    setIsSending(true);
    const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;

    try {
      // Get unique chat IDs from subscribers
      const chatIds = Array.from(
        new Set(
          subscribers
            .map((sub) => sub.chatId)
            .filter((chatId): chatId is string => !!chatId)
        )
      );

      if (chatIds.length === 0) {
        setModal({
          isOpen: true,
          title: "Error",
          message: "No subscribers with chat IDs found!",
          type: "error",
        });
        return;
      }

      // Add greeting based on selected language
      let finalMessage = message;
      switch (selectedLanguage) {
        case "french":
          finalMessage = `Bonjour ${message}`;
          break;
        case "thai":
          finalMessage = `Sawasdee-krub ${message}`;
          break;
        case "japanese":
          finalMessage = `Konnichiwa ${message}`;
          break;
        case "english":
        default:
          finalMessage = message;
          break;
      }

      for (const chatId of chatIds) {
        const response = await fetch(
          `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              chat_id: chatId,
              text: finalMessage,
            }),
          }
        );

        const data = await response.json();

        if (!data.ok) {
          console.error("Failed to send to", chatId, data.description);
        }
      }

      setModal({
        isOpen: true,
        title: "Success",
        message: "Messages sent!",
        type: "success",
      });
      setMessage("");
    } catch (error) {
      console.error("Error:", error);
      setModal({
        isOpen: true,
        title: "Error",
        message: "Error sending messages",
        type: "error",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleCheckForSubscribers = async () => {
    setIsChecking(true);

    try {
      const subs = await getSubscribers();

      // Create a Map to store unique subscribers by chatId
      const uniqueSubs = new Map();

      // Process all new subscribers and keep only the latest one per chatId
      subs.forEach((sub) => {
        uniqueSubs.set(sub.chatId, sub);
      });

      // Now process only unique subscribers
      for (const { chatId, username } of uniqueSubs.values()) {
        // Check if already in our store
        const existing = subscribers.find((sub) => sub.chatId === chatId);

        if (!existing) {
          const subscriber = addSubscriber(username);
          // Update with chatId
          updateSubscriber(subscriber.id, { chatId });
          // alert(`New subscriber: @${username}`);
        }
      }

      if (subs.length === 0) {
        setModal({
          isOpen: true,
          title: "Info",
          message:
            "No new subscribers found. Make sure you clicked /start in the bot.",
          type: "info",
        });
      }
    } catch (error) {
      console.error("Error checking subscribers:", error);
      setModal({
        isOpen: true,
        title: "Error",
        message: "Error checking for subscribers",
        type: "error",
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white border-4 border-black p-4 sm:p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="text-3xl sm:text-4xl font-black mb-6 text-black uppercase tracking-tight">
          Admin Page
        </h1>

        {/* Message Text Area */}
        <div className="mb-6">
          <label className="block mb-2 font-bold text-black uppercase text-sm">
            Message:
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="w-full min-h-[120px] p-3 border-4 border-black font-mono text-sm focus:outline-none focus:ring-4 focus:ring-yellow-300 resize-y"
          />
        </div>

        {/* Language Dropdown */}
        <div className="mb-6">
          <label className="block mb-2 font-bold text-black uppercase text-sm">
            Language:
          </label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full p-3 border-4 border-black font-bold bg-white cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* Channel Selector */}
        <div className="mb-6">
          <label className="block mb-2 font-bold text-black uppercase text-sm">
            Channels:
          </label>
          <div className="flex gap-4 flex-wrap bg-gray-100 p-4 border-4 border-black">
            {Object.entries(selectedChannels).map(([channel, isSelected]) => (
              <label
                key={channel}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() =>
                    handleChannelToggle(
                      channel as keyof typeof selectedChannels
                    )
                  }
                  className="w-5 h-5 border-2 border-black cursor-pointer accent-green-400"
                />
                <span className="font-bold text-black capitalize">
                  {channel}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!message.trim() || isSending}
          className={`w-full sm:w-auto px-8 py-3 font-bold text-black uppercase border-4 border-black transition-all ${
            !message.trim() || isSending
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-green-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 cursor-pointer"
          }`}
        >
          {isSending ? "Sending..." : "Send Message"}
        </button>

        {/* Check for New Subscribers Button */}
        <div className="mt-8 text-center bg-blue-100 p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <button
            onClick={handleCheckForSubscribers}
            disabled={isChecking}
            className={`px-8 py-3 font-bold text-black uppercase border-4 border-black transition-all ${
              isChecking
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-yellow-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 cursor-pointer"
            }`}
          >
            {isChecking ? "Checking..." : "Check for Subscribers"}
          </button>
          <p className="text-xs text-gray-700 mt-3 font-medium">
            After scanning QR and clicking /start, click this button
          </p>
        </div>

        {/* Subscriber Count */}
        <div className="mt-8 text-center bg-pink-200 p-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <strong className="text-2xl font-black text-black uppercase">
            Total Subscribers: {subscribers.length}
          </strong>
        </div>

        {/* Subscriber List */}
        <div className="mt-8">
          <h3 className="text-2xl font-black mb-4 text-black uppercase">
            Current Subscribers:
          </h3>
          {subscribers.length === 0 ? (
            <p className="text-gray-600 font-medium bg-gray-100 p-6 border-4 border-black">
              No subscribers yet. Scan the QR code to subscribe!
            </p>
          ) : (
            <ul className="space-y-4">
              {subscribers.map((sub) => (
                <li
                  key={sub.id}
                  className="p-4 border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                >
                  <div className="mb-2">
                    <strong className="text-lg font-bold text-black">
                      @{sub.username}
                    </strong>
                    {sub.chatId && (
                      <span className="ml-3 text-sm text-gray-600 font-mono">
                        (Chat ID: {sub.chatId})
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mb-3 font-medium">
                    Subscribed: {new Date(sub.subscribedAt).toLocaleString()}
                  </div>
                  {/* <button
                    onClick={() => removeSubscriber(sub.id)}
                    className="px-4 py-2 text-sm font-bold bg-red-400 text-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
                  >
                    Remove
                  </button> */}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />
    </div>
  );
}
