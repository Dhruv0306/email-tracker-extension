import CONFIG from "./config.js";
import { handleEmailOpened, updateBadge } from "./utils.js";

let socket;

function connect() {
    chrome.runtime.onStartup.addListener(updateBadge);
    chrome.runtime.onInstalled.addListener(updateBadge);
    socket = new WebSocket(CONFIG.WS_URL);

    socket.onopen = () => {
        console.log("✅ Connected to Email Tracker server");
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "email_opened") {
            chrome.notifications.create({
                type: "basic",
                iconUrl: "icons/icon-128.png",
                title: "Email Opened",
                message: `Email ${data.email_id} opened by ${data.recipient}`
            });
            handleEmailOpened(event);
            updateBadge();
        }
    };

    socket.onclose = () => {
        console.log("❌ Socket closed. Reconnecting...");
        setTimeout(connect, 3000);
    };
}

chrome.alarms.create("ws-heartbeat", {
    periodInMinutes: 0.5
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "ws-heartbeat") {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            connect();
        } else {
            socket.send(JSON.stringify({ type: "ping" }));
        }
    }
});

connect();
