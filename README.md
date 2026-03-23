# 🧺 Laundry

<div align="center">

<img src="https://img.shields.io/badge/react-19+-61DAFB.svg?style=for-the-badge&logo=react" alt="React">
<img src="https://img.shields.io/badge/firebase-latest-FFCA28.svg?style=for-the-badge&logo=firebase" alt="Firebase">
<img src="https://img.shields.io/badge/three.js-latest-black.svg?style=for-the-badge&logo=threedotjs" alt="Three.js">
<img src="https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge" alt="License">

**Shared house management with 3D visualization**

[Installation](#installation) · [Usage](#usage) · [Deploy](#deployment)

</div>

---

Laundry is a real-time web app for managing a 14-room shared house across 4 floors — covering laundry queues, task rotations, and presence tracking, backed by Firebase and visualized in 3D with Three.js.

---

## Installation

```bash
git clone <your-repo-url>
cd Laundry
npm install
cp .env.example .env
# Fill in your Firebase credentials
```

---

## Setup Firebase

1. Create a Firebase project and enable Realtime Database
2. Add credentials to `.env`:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_DATABASE_URL=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

3. Set Realtime Database rules:

```json
{
  "rules": {
    "laundry":   { ".read": true, ".write": true },
    "tasks":     { ".read": true, ".write": true },
    "presence":  { ".read": true, ".write": true }
  }
}
```

---

## Usage

```bash
npm run dev    # http://localhost:5173
npm run build
npm run deploy # GitHub Pages
```

Login with your room code (e.g. `ALPHA-1001`), then use the **Laundry**, **Tasks**, and **Presence** tabs.

---

## Features

- Animated washing machine and dryer with real-time status
- 3D house model with lit windows showing occupancy
- Automatic task rotation (kitchen, shower, toilet paper)
- Room-based auth — 14 unique codes, no personal data stored

---

## Deployment

```bash
# GitHub Pages (recommended)
npm run deploy

# Manual
npm run build
# Upload dist/ to your host
```

---

## License

MIT

---

<div align="center">
Made with ❤️ by <a href="https://github.com/NoamFav">NoamFav</a>
</div>
