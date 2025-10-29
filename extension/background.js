// ──────────────────────────────────────────────
//  Load the local Socket.IO client (bundled file)
// ──────────────────────────────────────────────
import io from "./socket.io.client.mjs";

const SERVER_URL = "http://localhost:5000";
const socket = io(SERVER_URL, {
  transports: ["websocket"],
  reconnection: true
});

// ──────────────────────────────────────────────
//  Socket event handlers
// ──────────────────────────────────────────────
socket.on("connect", () => {
  console.log("✅ Connected to Email Tracker Server:", socket.id);
});

socket.on("disconnect", () => {
  console.log("❌ Disconnected from server");
});

socket.on("emailOpened", (data) => {
  console.log("📩 Email opened:", data);
  const title = "Email Opened";
  const timestamp = data.timestamp ? new Date(data.timestamp).toLocaleTimeString() : 'unknown time';
  const message = `${data.recipient || 'Unknown'} opened ${data.emailId || 'unknown email'} at ${timestamp}`;

  chrome.notifications.create({
    type: "basic",
    iconUrl: chrome.runtime.getURL("icons/icon48.png"),
    title,
    message
  }, (notificationId) => {
    if (chrome.runtime.lastError) {
      console.error("Failed to create notification:", chrome.runtime.lastError);
    }
  });

  // Save to storage for popup display
  chrome.storage.local.get(["events"], (result) => {
    if (chrome.runtime.lastError) {
      console.error("Failed to get events from storage:", chrome.runtime.lastError);
      return;
    }
    const events = result.events || [];
    events.unshift(data);
    chrome.storage.local.set({ events }, () => {
      if (chrome.runtime.lastError) {
        console.error("Failed to save events to storage:", chrome.runtime.lastError);
      }
    });
  });
});
