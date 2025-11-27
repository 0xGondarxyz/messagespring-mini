import { useState } from "react";
import { useSubscriberStore } from "../store/subscriberStore";
import { getSubscribers } from "../services/telegramService";

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
        alert("No subscribers with chat IDs found!");
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

      alert("Messages sent!");
      setMessage("");
    } catch (error) {
      console.error("Error:", error);
      alert("Error sending messages");
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
        alert(
          "No new subscribers found. Make sure you clicked /start in the bot."
        );
      }
    } catch (error) {
      console.error("Error checking subscribers:", error);
      alert("Error checking for subscribers");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Admin Page</h1>

      {/* Message Text Area */}
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}
        >
          Message:
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          style={{
            width: "100%",
            minHeight: "120px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "14px",
            resize: "vertical",
          }}
        />
      </div>

      {/* Language Dropdown */}
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}
        >
          Language:
        </label>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        >
          {languages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      {/* Channel Selector */}
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}
        >
          Channels:
        </label>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {Object.entries(selectedChannels).map(([channel, isSelected]) => (
            <label
              key={channel}
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() =>
                  handleChannelToggle(channel as keyof typeof selectedChannels)
                }
                style={{ margin: 0 }}
              />
              <span style={{ textTransform: "capitalize" }}>{channel}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Send Button */}
      <button
        onClick={handleSend}
        disabled={!message.trim() || isSending}
        style={{
          padding: "10px 20px",
          backgroundColor: !message.trim() || isSending ? "#6c757d" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          fontSize: "16px",
          cursor: !message.trim() || isSending ? "not-allowed" : "pointer",
        }}
      >
        {isSending ? "Sending..." : "Send Message"}
      </button>

      {/* Check for New Subscribers Button */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button
          onClick={handleCheckForSubscribers}
          disabled={isChecking}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: isChecking ? "not-allowed" : "pointer",
          }}
        >
          {isChecking ? "Checking..." : "Check for Subscribers"}
        </button>
        <p style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
          After scanning QR and clicking /start, click this button
        </p>
      </div>

      {/* Subscriber Count */}
      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <strong style={{ fontSize: "18px" }}>
          Total Subscribers: {subscribers.length}
        </strong>
      </div>

      {/* Subscriber List */}
      <div style={{ marginTop: "30px" }}>
        <h3>Current Subscribers:</h3>
        {subscribers.length === 0 ? (
          <p>No subscribers yet. Scan the QR code to subscribe!</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {subscribers.map((sub) => (
              <li
                key={sub.id}
                style={{
                  padding: "10px",
                  marginBottom: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                }}
              >
                <div>
                  <strong>@{sub.username}</strong>
                  {sub.chatId && (
                    <span style={{ marginLeft: "10px", color: "#666" }}>
                      (Chat ID: {sub.chatId})
                    </span>
                  )}
                </div>
                <div style={{ fontSize: "12px", color: "#999" }}>
                  Subscribed: {new Date(sub.subscribedAt).toLocaleString()}
                </div>
                <button
                  onClick={() => removeSubscriber(sub.id)}
                  style={{
                    marginTop: "5px",
                    padding: "5px 10px",
                    fontSize: "12px",
                    background: "#ff4444",
                    color: "white",
                    border: "none",
                    borderRadius: "3px",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
