# Khula Hai

“Is it open today?” for India — banks, share market (NSE/BSE) and post offices, by city, in English and Hindi.

- Next.js App Router, static pages with ISR (5-minute revalidate on “today” pages) + a Vercel cron at 00:01 IST that revalidates everything.
- “Today” is always computed in IST (`Asia/Kolkata`) regardless of server timezone (`lib/date.ts`).
- Data (official sources only) lives in `data/`:
  - `rbi-2026.json` — RBI Holiday Matrix, all 34 regional offices (scraped from rbi.org.in on 2026-11-11)
  - `nse-2026.json` — NSE trading holidays (equity), matched against BSE notices 20251212-8 and 20260112-8
  - `central.json` — DoPT central government holidays 2026 (with the 22 May 2026 Bakrid change) and 2027
- Site URL / canonical: `NEXT_PUBLIC_SITE_URL` (defaults to `https://khulahai.in`).

To update for 2027: add `rbi-2027.json` / `nse-2027.json` once RBI and the exchanges publish, and bump `DATA_YEAR` handling in `lib/data.ts`.
