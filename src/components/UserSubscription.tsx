// import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function UserSubscription() {
  const botUsername = import.meta.env.VITE_TELEGRAM_BOT_USERNAME;
  const telegramBotLink = `https://t.me/${botUsername}?start=subscribe`;

  // Add this line right after:
  console.log("QR Code URL:", telegramBotLink);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white border-4 border-black p-6 sm:p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="text-3xl sm:text-4xl font-black mb-4 text-black uppercase tracking-tight">
          MessageSpring Mini
        </h1>
        <p className="text-base sm:text-lg text-gray-700 mb-8 font-medium">
          Subscribe to receive emergency alerts and city updates via Telegram
        </p>

        {/* QR Code Section */}
        <div className="mt-8 bg-pink-100 border-4 border-black p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-xl sm:text-2xl font-bold mb-6 text-black uppercase">
            Scan to Subscribe
          </h3>
          <div className="flex justify-center mb-6 bg-white p-4 border-2 border-black">
            <QRCodeSVG
              value={telegramBotLink}
              size={200}
              className="max-w-full h-auto"
            />
          </div>
          <p className="text-sm sm:text-base text-gray-800 font-medium text-center">
            Or click:{" "}
            <a
              href={telegramBotLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 px-4 py-2 bg-blue-400 text-black font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              Subscribe via Telegram
            </a>
            {/* <a href={telegramBotLink} target="_blank" rel="noopener noreferrer">
              Subscribe via Telegram
            </a> */}
          </p>
        </div>
      </div>
    </div>
  );
}
