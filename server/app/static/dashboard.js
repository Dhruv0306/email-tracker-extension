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

    // Recipients table
    const recipientsBody = document.querySelector("#recipients-table tbody");
    recipientsBody.innerHTML = "";

    recipients.forEach(r => {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${r.recipient}</td>
        <td>${r.open_count}</td>
        `;
        recipientsBody.appendChild(row);
    });

    // Opens table
    const opensBody = document.querySelector("#opens-table tbody");
    opensBody.innerHTML = "";

    opens.forEach(o => {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${o.recipient}</td>
        <td>${new Date(o.opened_at).toLocaleString()}</td>
        <td>${o.ip_address ?? "-"}</td>
        <td style="max-width:300px; overflow:hidden; text-overflow:ellipsis;">
            ${o.user_agent ?? "-"}
        </td>
        `;
        opensBody.appendChild(row);
    });
}

loadEmails();
