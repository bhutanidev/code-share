# CodeShare

> Real-time collaborative code editing made simple and powerful.

---

## 🖼️ Preview Screenshots

### 🧭 Landing Page – Dark Mode
![Landing Page Dark](https://github.com/user-attachments/assets/5295e6b0-a01a-4591-978e-ff48625ce103)

### 🧑‍💻 Join a Room Instantly
![Join Room](https://github.com/user-attachments/assets/b41f7abb-b8a3-4631-aeba-2011573d0a0c)

### 📚 Awareness Indicators
*See who’s editing and where in real-time.*
![Awareness](https://github.com/user-attachments/assets/e92b6770-e74d-43cb-830e-0e9666253abf)

### 🤖 Room + AI Chatbot Integration
![Room and Bot](https://github.com/user-attachments/assets/08526d03-8b62-4cbf-abf8-d6fb64abe550)

### ☀️ Landing Page – Light Mode
![Landing Page Light](https://github.com/user-attachments/assets/af2c797a-3d11-4cd0-afc8-0640ec25d191)

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

