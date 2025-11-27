import { useState } from "react";
import { useSubscriberStore } from "../store/subscriberStore";

export default function UserSubscription() {
  const [username, setUsername] = useState("");
  const { subscribers, addSubscriber, removeSubscriber } = useSubscriberStore();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      alert("Please enter a username");
      return;
    }

    addSubscriber(username.trim());
    setUsername(""); // Clear input after subscribing
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>City Alerts Project</h1>
      <p>Subscribe to receive emergency alerts and city updates</p>

      {/* Subscription Form */}
      <form onSubmit={handleSubscribe} style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Enter your Telegram username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: "10px",
            width: "300px",
            marginRight: "10px",
            border: "1px solid #ccc",
          }}
        />
        <button type="submit" style={{ padding: "10px 20px" }}>
          Subscribe
        </button>
      </form>

      {/* Subscriber Count */}
      <div style={{ marginTop: "20px" }}>
        <strong>Total Subscribers: {subscribers.length}</strong>
      </div>

      {/* Subscriber List (for testing/debugging) */}
      <div style={{ marginTop: "30px" }}>
        <h3>Current Subscribers:</h3>
        {subscribers.length === 0 ? (
          <p>No subscribers yet</p>
        ) : (
          <ul>
            {subscribers.map((sub) => (
              <li key={sub.id}>
                {sub.username} - Subscribed at:{" "}
                {sub.subscribedAt.toLocaleString()}
                <button
                  onClick={() => removeSubscriber(sub.id)}
                  style={{ marginLeft: "10px", padding: "5px 10px" }}
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
