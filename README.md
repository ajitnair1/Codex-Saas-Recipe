# Recipe Generator (Next.js)

Simple SaaS MVP: one-page UI that drafts recipes from ingredients and dietary notes via the `/api/generate` route (OpenAI).

## Setup

1) Install dependencies (already done in this workspace): `npm install`
2) Add your OpenAI key: create `.env.local` with `OPENAI_API_KEY=sk-...`

## Run locally

```bash
npm run dev
# visit http://localhost:3000
```

## Production checks

- Lint: `npm run lint`
- Build: `npm run build`
