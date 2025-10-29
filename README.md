# 📧 Email Tracker Extension

A **Chrome & Edge browser extension** paired with a lightweight **Node.js backend** that allows you to track when your sent emails are opened, view per-recipient open counts, and receive **real-time desktop notifications** when an email is opened.

---

## 🚀 Features

- 🔍 **Email Open Tracking** — uses a unique 1×1 tracking pixel.
- 👥 **Per-Recipient Insights** — see who opened your emails and when.  
- ⚡ **Real-Time Notifications** — instant popup alerts when an email is opened.
- 📊 **Dashboard View** — extension popup shows live stats for each email.
- 🌐 **Cross-Browser Support** — works on both Chrome and Microsoft Edge.
- 🧩 **Modular Architecture** — Node.js backend + extension frontend.
- 🛡️ **Privacy Aware** — built for opt-in, user-consented tracking scenarios.

---

## 🧠 Overview

This project is split into two main parts:

```
email-tracker-extension/
│
├── extension/ # Browser extension code (Manifest v3)
│ ├── manifest.json
│ ├── background.js
│ ├── popup.html
│ ├── popup.js
│ ├── content.js
│
├──server/
  ├── node_modules/
      |  ├── track.js
      |  ├── EmailOpen.js
      ├── utils/
        └── notify.js
```

## ⚙️ How It Works

1. The extension embeds a **unique tracking pixel** (a 1×1 transparent image) inside your outgoing email.  
2. When the recipient opens the email, their email client loads that image from your backend server.  
3. The backend records the open event and sends a **real-time WebSocket notification** to your extension.  
4. The extension’s background script receives the event and triggers a **desktop notification** + updates the dashboard.

---

## 🏗️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/<your-username>/email-tracker-extension.git
cd email-tracker-extension
```
--- 

```bash
cd server

This starts a simple Express + Socket.IO server that:
- Serves tracking pixel requests at /track/:token.png
- Broadcasts real-time "emailOpened" events via WebSocket

---

### 3️⃣ Load the Extension

**1.** Open **Chrome** or **Microsoft** **Edge**
**2.** Go to: `chrome://extensions/`
**3.** Enable **Developer Mode** (toggle top-right)
**4.** Click **Load Unpacked**
Click it to open the dashboard popup.

---

## 🧩 Extension Components

| File            | Description                                                            |
| --------------- | ---------------------------------------------------------------------- |
| `manifest.json` | Defines permissions, background script, popup, and icons.              |
| `background.js` | Maintains WebSocket connection & handles notifications.                |
| `popup.html`    | Simple dashboard UI.                                                   |
| `popup.js`      | Fetches and displays tracked events.                                   |
| `content.js`    | (Optional) Injects tracking pixels into Gmail/Outlook compose windows. |

---

## 🧾 Example Notification

When a recipient opens your tracked email, you’ll receive a real-time notification like:
✉️ Email Opened
test@example.com opened your email at 6:42 PM

---

## 🛡️ Privacy & Legal Notice

Email open tracking involves processing recipient metadata such as IP addresses and user agents.
If you plan to distribute or use this tracker in production:
- Obtain explicit consent from recipients before tracking.
- Provide a clear privacy notice and opt-out option.
- Comply with data protection laws (e.g., GDPR, ePrivacy Directive).


-  Implement backend tracking endpoint (/track/:token.png)
-  Add real-time WebSocket events
-  Email integration (Nodemailer or API)
-  Web Push notifications (outside browser)
-  Cross-browser packaging (Firefox support)

---

## 🧰 Tech Stack

| Layer                        | Technology                          |
| ---------------------------- | ----------------------------------- |
| **Frontend (Extension)**     | HTML, JS (Manifest V3), Chrome APIs |
| **Backend**                  | Node.js, Express, Socket.IO         |
| **Database (optional)**      | PostgreSQL / SQLite                 |
| **Email Sending (optional)** | Nodemailer                          |
| **Notifications**            | Chrome Notifications API            |

---

## 🧑‍💻 Author

**Dhruv Patel**
📬 GitHub[https://github.com/Dhruv0306]
💡 Open to collaboration, feedback, and feature requests!

---

## ⚖️ License

This project is licensed under the <MIT License>[https://github.com/Dhruv0306/email-tracker-extension/blob/main/LICENSE].

---

## 💬 Contributing

Pull requests are welcome!
Please follow these steps:

1. Fork the repo
2. Create a feature branch (`feature/your-feature`)
3. Commit changes
4. Open a Pull Request describing your updates

---

## 💡 Tip

You can easily expand this project into a multi-user SaaS email tracking platform by:
- Adding authentication
- Creating per-user pixel namespaces
- Deploying the backend to a cloud service (e.g., Render, Railway, or Vercel)

---

💬 "Built for developers who want to learn the internals of email tracking and privacy-safe telemetry."
