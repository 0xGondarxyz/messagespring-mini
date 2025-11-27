import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useSubscriberStore } from "../store/subscriberStore";
import { getNewSubscribers } from "../services/telegramService";

export default function UserSubscription() {
  const [isChecking, setIsChecking] = useState(false);
  const { subscribers, addSubscriber, removeSubscriber, updateSubscriber } =
    useSubscriberStore();

  const botUsername = import.meta.env.VITE_TELEGRAM_BOT_USERNAME;
  const telegramBotLink = `https://t.me/${botUsername}?start=subscribe`;

  // Add this line right after:
  console.log("QR Code URL:", telegramBotLink);

  const handleCheckForNewSubscribers = async () => {
    setIsChecking(true);

    try {
      const newSubs = await getNewSubscribers();

      // Create a Map to store unique subscribers by chatId
      const uniqueSubs = new Map();

      // Process all new subscribers and keep only the latest one per chatId
      newSubs.forEach((sub) => {
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

      if (newSubs.length === 0) {
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
      <h1>City Alerts Project</h1>
      <p>Subscribe to receive emergency alerts and city updates via Telegram</p>

      {/* QR Code Section */}
      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <h3>Scan to Subscribe</h3>
        <QRCodeSVG value={telegramBotLink} size={200} />
        <p style={{ marginTop: "10px" }}>
          Or click:{" "}
          <a href={telegramBotLink} target="_blank" rel="noopener noreferrer">
            Subscribe via Telegram
          </a>
        </p>
      </div>

      {/* Check for New Subscribers Button */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button
          onClick={handleCheckForNewSubscribers}
          disabled={isChecking}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: isChecking ? "not-allowed" : "pointer",
          }}
        >
          {isChecking ? "Checking..." : "Check for New Subscribers"}
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
