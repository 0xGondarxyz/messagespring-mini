import React, { useState } from "react";

export default function AdminPage() {
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
      // TODO: Replace with actual subscriber chat IDs from your store
      const chatIds = ["7102737955"]; // Add multiple chat IDs to send to all subscribers

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
              text: message,
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
    </div>
  );
}
