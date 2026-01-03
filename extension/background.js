import CONFIG from "./config.js";

let socket;

function connect() {
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
        }
    };

    socket.onclose = () => {
        console.log("❌ Socket closed. Reconnecting...");
        setTimeout(connect, 3000);
    };
}

connect();
