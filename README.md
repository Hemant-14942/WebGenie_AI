# WebGenie AI - Full-Stack AI Website Builder

WebGenie AI is a modern full-stack platform that turns natural-language prompts into production-style websites.  
It combines AI generation, chat-based iteration, code view, profile/workspace management, and temporary slug-based deployment links.

---

## What This Project Includes

- **Prompt -> Website generation** with credit-based usage
- **Builder workspace** with:
  - Live preview
  - AI chat refinement
  - Code view (Monaco + Prettier formatting)
- **Responsive UX** (desktop split layout + mobile bottom-sheet chat)
- **Workspace dashboard** with generated website cards and preview
- **Public deploy links** (`/sites/[slug]`) for shared preview
- **Modern landing pages**:
  - Home (Hero, Why Choose Us, Pricing, FAQ, Footer)
  - About
  - Contact
- **Motion system** using Framer Motion reveal-on-scroll

---

## Tech Stack

### Client (`/client`)
- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- Redux Toolkit
- Monaco Editor (`@monaco-editor/react`)
- Framer Motion
- Axios

### Server (`/server`)
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT auth + cookie sessions
- Zod validation

---

## Project Structure

```text
ai-website-builder/
├─ client/
│  ├─ src/app/
│  │  ├─ page.tsx
│  │  ├─ about/page.tsx
│  │  ├─ contact/page.tsx
│  │  ├─ login/page.tsx
│  │  ├─ sites/[slug]/page.tsx
│  │  └─ (protected)/
│  │     ├─ generate/page.tsx
│  │     ├─ builder/[id]/page.tsx
│  │     └─ profile/page.tsx
│  ├─ src/components/
│  │  ├─ home/
│  │  └─ ui/
│  └─ ...
├─ server/
│  ├─ src/controllers/
│  ├─ src/routes/
│  ├─ src/models/
│  └─ ...
└─ README.md
```

---

## Getting Started

### 1) Clone and install

```bash
git clone <your-repo-url>
cd ai-website-builder
```

Install dependencies in both apps:

```bash
cd client && npm install
cd ../server && npm install
```

---

## Environment Variables

Create env files:

- `client/.env.local`
- `server/.env`

### Client env

```env
NEXT_PUBLIC_SERVER_URL=http://localhost:5000
```

### Server env

```env
PORT=5000
MONGO_URI=<your-mongodb-uri>
DB_NAME=ai-website-builder
JWT_SECRET=<strong-secret>
IN_PROD=false
OPENAI_API_KEY=<openrouter-api-key>
OPENAI_MODEL=deepseek/deepseek-chat
DEPLOYMENT_URL=http://localhost:3000/sites
```

> Security note: Never commit real secrets. If credentials were exposed during development, rotate them immediately.

---

## Run Locally

### Start server

```bash
cd server
npm run dev
```

### Start client

```bash
cd client
npm run dev
```

Open:
- Client: `http://localhost:3000`
- Server: `http://localhost:5000`

---

## Useful Scripts

### Client

```bash
npm run dev
npm run build
npm run start
npm run lint
```

### Server

```bash
npm run dev
npm run build
npm run start
```

---

## Core API Overview

### Auth
- `POST /api/auth/google`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Website Builder (authenticated)
- `POST /api/build-website`
- `GET /api/website/:id`
- `POST /api/website/:id/chat`
- `GET /api/websites`
- `POST /api/website/:id/deploy`

### Public
- `GET /api/sites/:slug`

---

## Deploy Flow (Current Temporary Version)

1. User clicks **Deploy** in builder.
2. Server creates/returns slug + deployed URL.
3. Website is marked as deployed in MongoDB.
4. Public page is available at:
   - `http://localhost:3000/sites/<slug>`

This is ideal for local/demo sharing before moving to full hosting infrastructure.

---

## UX Highlights

- Clean dark premium theme with green accent
- Scroll reveal animations for sections/components
- Mobile-first builder experience with chat bottom sheet
- Full-width public deployed preview without app navbar

---

## Troubleshooting

### Build fails with Google font fetch error (Turbopack)
- Usually network/font-fetch issue in `layout.tsx` font imports.
- Retry with stable internet or use local/system font fallback if needed.

### Deployed page asks auth
- Ensure route order in server router:
  - auth routes
  - public routes
  - authenticated routes

### Deploy button still shown after deploy
- Ensure frontend sets deploy state from `GET /api/website/:id` and updates on deploy success.

---

## Roadmap Ideas

- Real one-click hosting (Vercel/Netlify integration)
- Payment gateway integration for plan upgrades
- Team workspaces + collaboration permissions
- Website analytics for deployed slugs
- Version history + rollback

---

## License

Private/internal project unless you explicitly add an open-source license.

