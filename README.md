# 📧 Email Tracker Extension

A browser-based email tracking system that lets you know **when**, **how many times**, and **by whom** your emails are opened — with **real-time notifications** and a **dashboard for insights**.

> 🚧 This project is under active development and is being built incrementally in clearly defined phases.

---

## 🎯 Project Goals

The primary goals of this project are:

- Track email opens using a reliable and standards-based mechanism
- Notify the sender instantly when an email is opened
- Support multiple recipients per email
- Provide a clean dashboard to view historical open data
- Work seamlessly as a **Google Chrome / Microsoft Edge extension**
- Keep the system lightweight, privacy-conscious, and self-hostable

---

## 🧠 How It Works (High Level)

1. A **tracking pixel** (1×1 transparent image) is embedded into an email
2. When the recipient opens the email, the image is requested from the server
3. The server logs the event and notifies the sender in real time
4. The browser extension displays notifications and aggregated data

---

## 🧩 Planned Features

### ✅ Core Tracking
- Unique tracking pixel per email
- Open count per email
- Timestamp of each open
- Support for multiple recipients

### 🔔 Real-Time Notifications
- Instant browser notifications when an email is opened
- Background listener via extension service worker
- No email-based alerts (browser-only)

### 📊 Dashboard
- View all tracked emails
- See open counts per recipient
- Timeline of open events
- Filter and search by email ID or recipient

### 🧩 Browser Extension
- Chrome & Microsoft Edge support
- Automatic tracking pixel injection
- Badge counter for unread open events
- Popup UI for quick insights

### 🔐 (Future) User Accounts
- Authentication for multi-user support
- Per-user data isolation
- Secure API access

---

## 🗺️ Development Roadmap

### **Phase 1 – Core Tracking (MVP)**
- Minimal backend server
- Tracking pixel endpoint
- Basic open logging
- Manual testing via browser/email clients

### **Phase 2 – Extension Notifications**
- Browser extension setup (Manifest V3)
- Background service worker
- Real-time notifications on email open

### **Phase 3 – Dashboard & Persistence**
- Database integration
- REST APIs for querying events
- Dashboard UI

### **Phase 4 – Automation & Polish**
- Automatic pixel injection on email send
- Improved UX
- Deployment & production readiness

---

## 🛠 Tech Stack (Planned)

- **Browser Extension**: JavaScript (Manifest V3)
- **Backend**: Node.js (Express)
- **Database**: MongoDB (or SQLite for local mode)
- **Real-time Events**: WebSockets
- **Hosting**: Self-hosted / Cloud-friendly

---

## ⚠️ Disclaimer

This project is intended for **educational and personal productivity use**.  
Always comply with:
- Email provider policies
- Recipient privacy laws
- Applicable data protection regulations

---

## 📄 License

This project is licensed under the **MIT License**.  
See the [LICENSE](LICENSE) file for details.

---

## 🚀 Status

🟢 **Active Development**  
Currently working on **Phase 1 – Core Tracking**
