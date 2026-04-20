# Potato Bro Bot — AI Chat Platform

Full-stack desktop + web chat application with AI assistant, streaming responses, and modular architecture.

---

## Tech Stack

### Frontend
- React + TypeScript
- Tailwind CSS
- Electron (desktop wrapper)
- Vite
- react-router-dom

### Backend
- NestJS
- Prisma ORM
- PostgreSQL
- SSE (Server-Sent Events) streaming

### AI Layer
- Google Gemini API (`generateContentStream`)
- Custom AI engine (`potato-chat-engine`)
- Command system (`/commands`)
- Prompt routing via Character + UserSettings

### Infrastructure
- Custom logging engine (`potato-log-engine`)
- Docker support (planned / optional)

---
## Key Features

### Chat System
- Real-time AI chat
- Streaming responses (SSE / Gemini stream)
- Message separation: user / bot / system

### AI Engine
- Command handling (`/reset`, `/help`, custom commands)
- Prompt presets (character-based behavior)
- AI routing layer abstraction over Gemini

### Logging System
- Server lifecycle logging (start / shutdown)
- User & bot message tracking
- Structured log output into `.txt` files per session

### Backend Features
- Prisma-based DB models:
  - User
  - Character
  - UserSettings
  - Messages
- Auth (cookie-based)
- Validation via NestJS pipes
