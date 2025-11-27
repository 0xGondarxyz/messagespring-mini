import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useSubscriberStore } from "../store/subscriberStore";
import { getSubscribers } from "../services/telegramService";

export default function UserSubscription() {
  const [isChecking, setIsChecking] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { subscribers, addSubscriber, removeSubscriber, isRemoved, removedSubscribers } = useSubscriberStore();

  const botUsername = import.meta.env.VITE_TELEGRAM_BOT_USERNAME;
  const telegramBotLink = `https://t.me/${botUsername}?start=subscribe`;

  const handleSubscribe = async () => {
    try {
      setIsSubscribing(true);
      const currentSubs = await getSubscribers();
      
      // Find the current user in the subscribers list
      const currentUser = currentSubs[0]; // Assuming the most recent subscriber is first
      
      if (!currentUser) {
        alert("Please start the bot first by clicking the link below");
        return;
      }

      // Check if user was previously unsubscribed
      const wasRemoved = removedSubscribers.some(sub => sub.chatId === currentUser.chatId);
      
      if (wasRemoved) {
        // Remove from removedSubscribers and add back to subscribers
        const updatedRemoved = removedSubscribers.filter(sub => sub.chatId !== currentUser.chatId);
        const userToResubscribe = removedSubscribers.find(sub => sub.chatId === currentUser.chatId);
        
        if (userToResubscribe) {
          addSubscriber(userToResubscribe.username, userToResubscribe.chatId);
          alert(`Welcome back, ${userToResubscribe.username}! You've been resubscribed.`);
        }
      } else {
        // Regular subscription
        addSubscriber(currentUser.username, currentUser.chatId);
        alert(`Welcome, ${currentUser.username}! You've been subscribed.`);
      }
    } catch (error) {
      console.error("Subscription error:", error);
      alert("Error processing subscription. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleCheckForSubscribers = async () => {
    setIsChecking(true);

    try {
      const subs = await getSubscribers();

      for (const { chatId, username } of subs) {
        // Skip if user has unsubscribed
        if (isRemoved(chatId)) {
          console.log(`Skipping unsubscribed user: ${username} (${chatId})`);
          continue;
        }

        // Check if already subscribed
        const existing = subscribers.find((sub) => sub.chatId === chatId);

        if (!existing) {
          addSubscriber(username, chatId);
          console.log(`Added new subscriber: ${username} (${chatId})`);
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

  const handleRemoveSubscriber = (id: string) => {
    removeSubscriber(id);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>City Alerts Project</h1>
      <p>Subscribe to receive emergency alerts and city updates via Telegram</p>

      {/* QR Code Section */}
      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <h3>Scan to Subscribe</h3>
        <div 
          style={{ cursor: 'pointer', display: 'inline-block' }}
          onClick={handleSubscribe}
        >
          <QRCodeSVG value={telegramBotLink} size={200} />
        </div>
        <p style={{ marginTop: "10px" }}>
          <button 
            onClick={handleSubscribe}
            disabled={isSubscribing}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
              backgroundColor: isSubscribing ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              textDecoration: 'none',
            }}
          >
            {isSubscribing ? 'Processing...' : 'Subscribe via Telegram'}
          </button>
        </p>
      </div>

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
                  onClick={() => handleRemoveSubscriber(sub.id)}
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
