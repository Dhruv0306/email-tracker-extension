# Email Tracker Extension

A Chrome/Edge browser extension that tracks email opens via pixel tracking with real-time WebSocket notifications and a Python + FastAPI backend.

## Overview

Email Tracker provides:
- Invisible 1x1 pixel-based open tracking
- Real-time notifications delivered to the extension via WebSocket
- Open event history with IP, timestamp, and user-agent
- Per-draft toggle to opt a single email in/out of tracking
- JWT-based authentication with hashed passwords

## High-level Architecture

Client (Chrome Extension):
- `login` UI for sign-up and sign-in
- `content` script that intercepts Gmail compose dialogs and injects the pixel
- `background` service worker that handles auth, network requests, and WebSocket messaging
- `popup` UI that shows recent opens and quick actions

Server (Python FastAPI):
- REST API for auth and track registration
- Pixel-serving endpoint that logs opens and returns a tiny GIF
- WebSocket endpoint for pushing `email_opened` events to connected browser extensions
- PostgreSQL for production, SQLite optional for local dev

## Prerequisites

- Chrome/Chromium (developer mode enabled)
- Python 3.9+ (`pip` available)
- PostgreSQL for production; SQLite can be used for local testing

## Implementation Guide (expanded file descriptions)

Below are concise descriptions of each scaffold file and the responsibilities contained within them. Ask me to scaffold any of these into the repo.

1) Folder layout
- Top-level `extension/` (contains `icons/`, `assets/`, and `src/` files)
- `backend/` (FastAPI server and environment files)

---

2) Extension files and expected contents

- `manifest.json`:
  - Holds the extension manifest v3 metadata and privileges.
  - Ensure `permissions` include `storage`, `tabs`, and `notifications`.
  - Add `host_permissions` for Gmail and your backend (local dev origin).
  - Define `background.service_worker` to point at `src/background/service-worker.js` and the `action.default_popup` to the popup HTML.

- `src/login/login.html`:
  - Simple sign-up and login forms with accessible labels, required attributes, and areas for inline validation messages.
  - Include `login.js` via a script tag; keep layout minimal for extension popup pages.

- `src/login/login.js`:
  - Sends JSON POSTs to the backend `/api/auth/register` and `/api/auth/login` endpoints and expects an `access_token` + `user` in response.
  - Saves token + user to `chrome.storage.local` and sends a runtime message (`type: 'auth'`) to the service worker.
  - Handles form validation, error display, and closes the login window on success.

- `src/content/gmail-compose.js`:
  - Observes Gmail compose dialogs using a `MutationObserver`; initialize per-dialog once (WeakSet recommended).
  - Adds a small UI control (checkbox) near the send button for per-email tracking opt-in.
  - On send, if tracking is enabled, call the service worker via `chrome.runtime.sendMessage({type:'register_tracking', recipient, subject, body}, callback)` and await a `pixelUrl`.
  - Inject exactly one hidden `<img src="<pixelUrl>" width="1" height="1">` into the message body before allowing send to continue.
  - Be defensive: never break Gmail's native send flow — use event interception and safe fallbacks.

- `src/background/service-worker.js`:
  - Keeps `authToken` and `user` in memory and reads them from `chrome.storage.local` on startup.
  - Handles messages:
    - `register_tracking`: forwards the request to the server (`/api/track/register`) with `Authorization` header and returns the server response to the content script.
    - `auth`: stores token and connects WebSocket.
    - `logout`: clears stored token and closes WebSocket.
    - `get_notifs`: returns recent notifications stored in `chrome.storage.local`.
  - Manages a resilient WebSocket connection to `/ws?token=<JWT>` and calls `chrome.notifications.create` for `email_opened` messages while saving them to local storage.
  - Keep logic minimal to respect service worker lifecycle — reconnect when necessary and avoid long-running CPU tasks.

- `src/popup/popup.html` + `src/popup/popup.js`:
  - `popup.html` provides a compact UI to show the signed-in user and a scrollable list of recent `email_opened` events.
  - `popup.js` queries the service worker for stored notifications (`get_notifs`) and renders them, with options to logout or clear the list.

---

3) Backend files and expected behavior

- `requirements.txt`:
  - Include packages: `fastapi`, `uvicorn[standard]`, `sqlalchemy`, a DB driver (`psycopg2-binary` for Postgres or use SQLite), `python-jose` (JWT), `passlib[bcrypt]`, `python-dotenv`.

- `.env` / `.env.example`:
  - Define `DATABASE_URL` and `JWT_SECRET`. Optionally include other flags for dev.

- `main.py` (FastAPI app):
  - Database models/tables: `users`, `tracked_emails`, `tracking_events`.
  - Auth routes:
    - `POST /api/auth/register`: create user, hash password, return `access_token` + `user`.
    - `POST /api/auth/login`: verify password, return `access_token` + `user`.
  - Tracking routes:
    - `POST /api/track/register`: requires `Authorization: Bearer <token>`; creates a tracking row for the user and returns a `pixelUrl` referencing `/api/track/pixel/{tracking_id}`.
    - `GET /api/track/pixel/{tracking_id}`: logs an `open` event (IP and UA), schedules a non-blocking broadcast to any connected WebSocket clients that own the tracking id, and returns a 1x1 GIF.
  - WebSocket route:
    - `GET /ws`: authenticate via a JWT token (query param or header), then keep the socket open and accept broadcast events targeted to that user's connections.

---

4) Notes and suggestions

- For local HTTPS while developing the extension, prefer `mkcert` to generate trusted certs — avoids browser certificate errors.
- Use SQLite initially if you prefer zero-db setup; switch to Postgres for production and for better concurrency.
- Keep event broadcasts lightweight JSON objects (type, trackingId, recipient, subject, openedAt) so the extension can present them directly.