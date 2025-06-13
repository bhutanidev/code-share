# CodeShare

> Real-time collaborative code editing made simple and powerful.

---

## 🖼️ Preview Screenshots

### 🧭 Landing Page – Dark Mode
![Landing Page Dark](apps/web/public/landingpage-dark.jpg)

### 🧑‍💻 Join a Room Instantly
![Join Room](apps/web/public/joinroom.jpg)

### 📚 Awareness Indicators
*See who’s editing and where in real-time.*
![Awareness](apps/web/public/awareness.jpg)

### 🤖 Room + AI Chatbot Integration
![Room and Bot](apps/web/public/roomandbot.jpg)

### ☀️ Landing Page – Light Mode
![Landing Page Light](apps/web/public/landingpage-light.jpg)

---

## 🚀 Overview

**CodeShare** is a real-time collaborative code editor powered by **Yjs**, **CodeMirror 6**, and **WebSockets**. It lets developers write and share code together in live rooms with full sync and presence awareness.

Great for:
- Pair programming
- Live interviews
- Teaching and debugging sessions
- Team collaboration

---

## ✨ Features

- 🔄 Real-time collaborative editing
- 🎨 Syntax highlighting (JavaScript supported; more coming soon)
- 👥 Awareness indicators: cursor positions and user presence
- 🗃 Room-based collaboration
- 🤖 AI Bot integration (optional)
- 💾 Auto-save & restore sessions

---

## 📁 Monorepo Structure (Turborepo)
apps/
├── frontend # Next.js app with CodeMirror + Yjs integration
├── websocket # WebSocket server (room-based real-time sync)
└── backend # Optional REST API (room metadata, bot hooks)

packages/
└── ui # Shared UI components (shadcn/ui, Tailwind)


---

## 🧑‍💻 Tech Stack

- **Frontend**: React, Next.js, CodeMirror 6, TailwindCSS
- **Backend**: Node.js, Express, WebSocket
- **Collab Engine**: Yjs, y-codemirror.next
- **Monorepo**: Turborepo (pnpm workspaces)
- **Deployment**: Vercel (frontend) + Render/ECS (backend)

---


## 🛠️ Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/codeshare
cd codeshare
```
---

## 🧑‍💻 Tech Stack

- **Frontend**: React, Next.js, CodeMirror 6, TailwindCSS
- **Backend**: Node.js, Express, WebSocket
- **Collab Engine**: Yjs, y-codemirror.next
- **Monorepo**: Turborepo (pnpm workspaces)
- **Deployment**: Vercel (frontend) + Render/ECS (backend)

---

## 🛠️ Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/codeshare
cd codeshare
```
2. Install dependencies
```bash
pnpm install
```
3. Start the development server
```bash
pnpm run build
pnpm dev
```
This will launch both frontend and backend services (if using a Turborepo dev script).

