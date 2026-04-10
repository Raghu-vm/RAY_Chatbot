# RAY v4 - (Frontend + n8n Backend)

RAY v4 is a web-based AI assistant platform with:
- A Next.js frontend for chat, ticketing, dashboards, and admin user management
- An n8n workflow backend for RAG (retrieval-augmented generation) over uploaded documents

The app sends user questions to n8n, n8n retrieves relevant context from vector storage, runs Gemini for grounded answers, and returns structured JSON back to the UI.

## What This Project Does

### Frontend (Next.js)
- Authenticated app with role-aware UI (admin vs employee)
- AI chat interface with Markdown-rendered responses
- Session handling via cookies
- Recent chats in sidebar (stored locally)
- Ticket management (RAY Desk)
- Admin panel for employee account creation (Employee ID + password)

### Backend (n8n)
- Receives chat queries via webhook
- Normalizes input (`chatInput`, `sessionId`)
- Uses embeddings + PGVector retrieval from Postgres/Supabase-style vector table
- Uses Gemini model to generate answers grounded in retrieved docs
- Supports document ingestion flow (Google Drive triggers + file extraction)
- Supports chat history fetch via dedicated webhook

## Tech Stack

### Frontend
- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS
- Radix UI components
- `react-markdown` + `remark-gfm` for response rendering
- Local browser persistence: `localStorage` + cookies

### Backend / AI
- n8n (self-hosted)
- LangChain nodes in n8n
- Google Gemini (chat + embeddings)
- Postgres / PGVector
- Cohere reranker
- Google Drive integration for file ingestion

## Project Structure (Important Parts)

- `app/page.tsx`: Main shell and tab routing
- `app/api/chat/route.ts`: Server route forwarding chat payload to n8n webhook
- `components/chat-interface.tsx`: Main chat UI and session/recent chat persistence
- `components/sidebar.tsx`: Navigation + recent chat list
- `components/ray-desk-page.tsx`: Ticket management UI
- `components/admin-panel.tsx`: Employee credential creation and management
- `components/login-page.tsx`: Login UI (demo credentials removed)
- `Super_RAY.json`: Main n8n workflow export
- `SYSTEM_DOCUMENTATION.md`: Detailed system reference

## How It Works (End-to-End)

1. User logs in (admin or employee).
2. User enters a prompt in Chat.
3. Frontend auto-manages `sessionId` (cookie-based) and sends:
   - `POST /api/chat`
   - Body: `{ "chatInput": "...", "sessionId": "..." }`
4. Next.js API route forwards request to n8n webhook:
  - tries `http://localhost:5678/webhook-test/ray-rag-model`
  - falls back to `http://localhost:5678/webhook/ray-rag-model`
5. n8n workflow:
   - Normalizes fields in `Edit Fields`
   - Runs RAG retrieval + Gemini generation
   - Returns JSON response
6. Frontend renders answer as Markdown and stores chat/session metadata locally.

## API Contract

### Frontend -> Next.js
- Endpoint: `POST /api/chat`
- Request:
```json
{
  "chatInput": "Ask something about your docs",
  "sessionId": "session-123"
}
```

### Next.js -> n8n
- Endpoint: `POST http://localhost:5678/webhook-test/ray-rag-model`
- Same JSON body is forwarded.

### Expected response shape (flexible)
The UI supports multiple answer keys (for resilience), such as:
- `answer`
- `response`
- `output`
- `text`
- `message`

Optional keys:
- `source` (or first item in `sources`)
- `confidence`

## Local Persistence

### Cookies
- `ray_session_id`: Current chat session ID
- `ray_chat_history_v2`: Recent chat messages for current UI session

### localStorage
- `ray_recent_chats`: Sidebar recent chat entries
- `ray_current_user`: Currently logged-in user
- `ray_users`: User credentials/profile store
- `ray_tickets`: Ticket records

## Setup

## 1) Install dependencies
```bash
npm install
```

## 2) Run frontend
```bash
npm run dev
```
Open: `http://localhost:3000`

## 3) Run n8n
Make sure n8n is running and workflow is available at:
- `http://localhost:5678/webhook-test/ray-rag-model`
- `http://localhost:5678/webhook/ray-rag-model`

If using **test webhook** mode in n8n:
- Click **Execute workflow** before each test call

For persistent behavior:
- Activate workflow in n8n (required for production webhook URL)

## Authentication Notes

- Admin can create employee accounts in Admin Panel using:
  - Employee ID
  - Username
  - Password
  - Email
  - Department
- Login accepts **Employee ID or Username** + password.

## Standard Departments

Department values are standardized across employee creation and ticket creation:
- IT Support
- HR
- Finance
- Sales
- Operation
- Marketing

Existing ticket departments are normalized on load in RAY Desk.

## Common Troubleshooting

### Next.js lock error
Error: `Unable to acquire lock at .next/dev/lock`
- Stop existing Node/Next processes
- Remove `.next/dev/lock`
- Restart `npm run dev`

### n8n webhook not registered (404)
- Ensure workflow is executed/active
- Verify webhook path is exactly `ray-rag-model`

### Non-JSON response from webhook
- Check `Respond to Webhook` node configuration (`respondWith: json`)
- Validate output of agent node in n8n

### Chat memory input key error in n8n
- Ensure `Edit Fields` sets both:
  - `chatInput`
  - `sessionId`
- Ensure agent prompt uses `{{$json.chatInput}}`

## Notes

- Current config uses `next.config.mjs` with `ignoreBuildErrors: true` for TypeScript..
- This repository includes workflow exports so backend logic can be re-imported into n8n quickly.

---

If you want, this README can be split into two docs:
- `README.md` (frontend)
- `BACKEND.md` (n8n workflow and DB schema)
for cleaner long-term maintenance.
#
