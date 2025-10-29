chrome.storage.local.get(["events"], (result) => {
  if (chrome.runtime.lastError) {
    console.error("Failed to get events from storage:", chrome.runtime.lastError);
    return;
  }

  const events = result.events || [];
  const div = document.getElementById("events");

  if (events.length === 0) {
    div.innerHTML = "<p>No opens yet</p>";
    return;
  }

  try {
    div.innerHTML = events
      .map(
        (e) => `
          <div class="event">
            <strong>${e.recipient || 'Unknown'}</strong> opened <em>${e.emailId || 'Unknown'}</em><br/>
            <span class="timestamp">${new Date(e.timestamp).toLocaleString()}</span>
          </div>
        `
      )
      .join("");
  } catch (error) {
    console.error("Failed to render events:", error);
    div.innerHTML = "<p>Error loading events</p>";
  }
});
