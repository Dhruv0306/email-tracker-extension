import CONFIG from "./config.js";
import { updateBadge } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
	chrome.storage.local.get(["unseenOpens"], (res) => {
		const unseenOpens = res.unseenOpens || [];
		renderUnseenOpens(unseenOpens);
		markAllAsSeen();
	});

	document.getElementById("open-dashboard").onclick = () => {
		chrome.tabs.create({ url: `${CONFIG.API_BASE}/dashboard` });
	};
});

function renderUnseenOpens(unseenOpens) {
	const container = document.getElementById("unseen");

	if (unseenOpens.length === 0) {
		container.innerHTML = "<p>No new email opens</p>";
		return;
	}

	container.innerHTML = unseenOpens
		.slice(-10)
		.reverse()
		.map(
			(o) =>
				`<div class="open-item">
          <strong>${o.recipient}</strong> opened <em>${o.emailId}</em> at ${o.timestamp}
        </div>`
		)
		.join("");
}

function markAllAsSeen() {
	chrome.storage.local.set({ unseenOpens: [] }, () => {
		updateBadge();
	});
}