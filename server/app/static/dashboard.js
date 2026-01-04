async function loadEmails() {
    const res = await fetch("/api/emails/");
    const emails = await res.json();

    const tbody = document.querySelector("#emails-table tbody");
    tbody.innerHTML = "";

    emails.forEach(email => {
        const row = document.createElement("tr");
        row.innerHTML = `
      <td>${email.email_id}</td>
      <td>${email.total_opens}</td>
    `;
        row.onclick = () => loadDetails(email.email_id);
        tbody.appendChild(row);
    });
}

async function loadDetails(emailId) {
    const [recipientsRes, opensRes] = await Promise.all([
        fetch(`/api/emails/${emailId}`),
        fetch(`/api/emails/${emailId}/opens`)
    ]);

    const recipients = await recipientsRes.json();
    const opens = await opensRes.json();

    document.getElementById("details-content").textContent =
        JSON.stringify({ recipients, opens }, null, 2);
}

loadEmails();
