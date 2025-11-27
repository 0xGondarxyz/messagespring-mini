// import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function UserSubscription() {
  const botUsername = import.meta.env.VITE_TELEGRAM_BOT_USERNAME;
  const telegramBotLink = `https://t.me/${botUsername}?start=subscribe`;

  // Add this line right after:
  console.log("QR Code URL:", telegramBotLink);

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
    </div>
  );
}
