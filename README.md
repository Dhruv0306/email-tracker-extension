# 📧 Email Tracker Extension

A **Chrome & Edge browser extension** paired with a lightweight **Node.js backend** that allows you to track when your sent emails are opened, view per-recipient open counts, and receive **real-time desktop notifications** when an email is opened.

---

## 🚀 Features

- 🔍 **Email Open Tracking** — uses a unique 1×1 tracking pixel.
- 👥 **Per-Recipient Insights** — see who opened your emails and when.  
- ⚡ **Real-Time Notifications** — instant popup alerts when an email is opened.
- 📊 **Extension Dashboard** — popup shows live stats for each email
- 🌐 **Web Dashboard** — browser-based real-time tracking interface
- 🔄 **Live Updates** — WebSocket-powered real-time event streaming
- 🌐 **Cross-Browser Support** — works on both Chrome and Microsoft Edge
- 🧩 **Modular Architecture** — Node.js backend + extension frontend
- 🛡️ **Privacy Aware** — built for opt-in, user-consented tracking scenarios

---

## 🧠 Overview

This project is split into two main parts:

```
email-tracker-extension/
│
├── extension/              # Browser extension code (Manifest v3)
│   ├── manifest.json
│   ├── background.js
│   ├── popup.html
│   ├── popup.js
│   └── content.js
│
└── server/                 # Node.js backend server
    ├── src/
    │   ├── models/
    │   │   └── EmailEvent.js
    │   ├── routes/
    │   │   └── track.js
    │   ├── utils/
    │   │   └── notify.js
    │   └── index.js
    ├── public/
    │   └── dashboard/
    │       ├── index.html
    │       ├── dashboard.js
    │       └── style.css
    ├── test/
    │   └── client-test.js
    ├── .env
    └── package.json
```

## ⚙️ How It Works

1. The extension embeds a **unique tracking pixel** (a 1×1 transparent image) inside your outgoing email.  
2. When the recipient opens the email, their email client loads that image from your backend server.  
3. The backend records the open event and sends a **real-time WebSocket notification** to your extension.  
4. The extension’s background script receives the event and triggers a **desktop notification** + updates the dashboard.

## 🔄 Real-Time Connection

The extension maintains a persistent WebSocket connection to the backend server using Socket.IO:

- **Background Service Worker** — Runs continuously to receive real-time notifications
- **Local Storage** — Caches email open events for popup dashboard
- **Chrome Notifications API** — Shows desktop alerts when emails are opened
- **Auto-Reconnection** — Automatically reconnects if connection is lost

---

## 🏗️ Setup Instructions

### Prerequisites
- Node.js (for both server and extension dependencies)
- Chrome or Microsoft Edge browser
- MongoDB Atlas account (free tier available)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/<your-username>/email-tracker-extension.git
cd email-tracker-extension
```
--- 

### 2️⃣ Setup the Backend Server

**1.** Navigate to server directory:
```bash
cd server
```

**2.** Install dependencies:
```bash
npm install
```

**3.** Configure environment variables:
Create a `.env` file with:
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

**4.** Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

**5.** Access the dashboard:
Open `http://localhost:5000/dashboard/` to view the web dashboard

---

### 3️⃣ Setup Extension Dependencies

**1.** Navigate to extension directory:
```bash
cd extension
```

**2.** Install Socket.IO client:
```bash
npm install
```

**3.** Load the Extension in Browser:
- Open **Chrome** or **Microsoft Edge**
- Go to: `chrome://extensions/`
- Enable **Developer Mode** (toggle top-right)
- Click **Load Unpacked** and select the extension folder
- Click the extension icon to open the dashboard popup

---

## 📊 Web Dashboard

The project includes a real-time web dashboard accessible at `http://localhost:5000/dashboard/` that shows:

- **Live Email Opens** — Real-time notifications when emails are opened
- **Recipient Details** — Shows who opened which email
- **Timestamps** — Exact time when emails were opened
- **Clean UI** — Modern, responsive design with real-time updates

### Dashboard Features
- Real-time WebSocket connection
- Auto-updating event feed
- Clean, modern interface
- Mobile-responsive design

---

## 🔌 API Endpoints

### Tracking Pixel
- **GET** `/track/:emailId/:recipient`
  - Serves 1×1 transparent PNG pixel
  - Records email open event in database
  - Emits real-time WebSocket notification
  - **Parameters:**
    - `emailId`: Unique identifier for the email
    - `recipient`: Email address of the recipient

### Dashboard
- **GET** `/dashboard/`
  - Serves the web dashboard interface
  - Real-time WebSocket connection for live updates

---

## 🔧 Environment Configuration

### Required Environment Variables
Create a `.env` file in the `server/` directory:

```env
# MongoDB connection string
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Server port (default: 5000)
PORT=5000
```

### MongoDB Setup
1. Create a free MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Replace `<username>`, `<password>`, and `<database>` in the connection string

---

## 🧩 Extension Components

| File               | Description                                                            |
| ------------------ | ---------------------------------------------------------------------- |
| `manifest.json`    | Defines permissions, background script, popup, and icons (Manifest V3) |
| `background.js`    | Service worker with Socket.IO connection & real-time notifications    |
| `popup.html`       | Extension dashboard UI                                                 |
| `popup.js`         | Displays tracked events from local storage                            |
| `socket-client.js` | Socket.IO client module wrapper                                       |
| `content.js`       | (Optional) Injects tracking pixels into Gmail/Outlook compose windows |

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
| **Frontend (Extension)**     | HTML, JS (Manifest V3), Chrome APIs, Socket.IO |
| **Frontend (Dashboard)**     | HTML, CSS, JavaScript, Socket.IO    |
| **Backend**                  | Node.js, Express, Socket.IO         |
| **Database**                 | MongoDB Atlas, Mongoose              |
| **Real-time Communication** | WebSocket (Socket.IO)               |
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
