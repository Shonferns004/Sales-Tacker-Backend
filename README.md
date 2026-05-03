# Sales Tracker Backend

This folder is for server-only Supabase work such as admin imports, secure reports, or private automations.

The Expo app connects directly to Supabase with `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`. Keep `SUPABASE_SERVICE_ROLE_KEY` only on a server.

## Setup

1. Create a `.env` file from `.env.example`.
2. Run `backend/sql/001_create_leads.sql` in the Supabase SQL editor.
3. Restart Expo after changing environment variables.

## Suggested backend endpoints

- `GET /health` to verify the backend is alive.
- `GET /leads` for server-rendered reports.
- `POST /imports` for privileged CSV imports when you add authentication.
