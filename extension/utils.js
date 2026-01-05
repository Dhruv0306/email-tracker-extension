function handleEmailOpened(event) {
    chrome.storage.local.get(["unseenOpens"], (res) => {
        const unseenOpens = res.unseenOpens || [];
        const data = JSON.parse(event.data);

        unseenOpens.push({
            emailId: data.email_id,
            recipient: data.recipient,
            timestamp: data.timestamp,
        });

        chrome.storage.local.set({ unseenOpens }, updateBadge);
    });
}

function updateBadge() {
    chrome.storage.local.get(["unseenOpens"], (res) => {
        const count = res.unseenOpens?.length || 0;

        chrome.action.setBadgeText({
            text: count > 0 ? count.toString() : "",
        });

        chrome.action.setBadgeBackgroundColor({
            color: "#f40000", // red
        });
    });
}

export { handleEmailOpened, updateBadge };