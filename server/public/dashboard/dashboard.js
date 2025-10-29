const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("✅ Connected to tracker server");
});

socket.on("emailOpened", (data) => {
  const eventsDiv = document.getElementById("events");
  const div = document.createElement("div");
  div.className = "event";
  div.innerHTML = `
    <strong>${data.recipient}</strong> opened <em>${data.emailId}</em>
    <div class="timestamp">${new Date(data.timestamp).toLocaleString()}</div>
  `;
  eventsDiv.prepend(div);
});
