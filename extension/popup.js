import CONFIG from "./config.js";
const API_BASE = CONFIG.API_BASE;

async function loadEmails() {
  try {
    const res = await fetch(`${API_BASE}/emails/`);
    const emails = await res.json();

    const tbody = document.getElementById("emails-body");
    tbody.innerHTML = "";

    emails.slice(0, 5).forEach(email => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${email.email_id}</td>
        <td>${email.total_opens}</td>
      `;

      row.onclick = () => {
        chrome.tabs.create({
          url: `${CONFIG.API_BASE}/dashboard`
        });
      };

      tbody.appendChild(row);
    });
  } catch (err) {
    console.error("Failed to load emails", err);
  }
}

document.getElementById("open-dashboard").onclick = () => {
  chrome.tabs.create({
    url: `${CONFIG.API_BASE}/dashboard`
  });
};

loadEmails();
