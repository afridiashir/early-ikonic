# IKONIC — Early Access

Next.js 15 (App Router, TypeScript) landing page for IKONIC early access, with a
working two-step signup form.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build && npm start   # production
```

## Environment

Copy `.env.example` to `.env` (or `.env.local`) and fill it in. Next.js loads both
automatically; `.env` is gitignored.

| Variable | Purpose |
| --- | --- |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` | Mail server. Gmail: `smtp.gmail.com`, `587`, `false` (STARTTLS). |
| `SMTP_USER` / `SMTP_PASSWORD` | Sending account. For Gmail this must be an **App Password**, not the account password. Spaces are stripped. |
| `NOTIFY_EMAIL` | Where signup notifications land. |
| `SHEETS_WEBHOOK_URL` | Optional Google Apps Script web app that appends a row per signup. |
| `EARLY_ACCESS_JOINED` / `EARLY_ACCESS_GOAL` | The counter on the page. Defaults `2847` / `5000`. |
| `SITE_URL` | Canonical URL for Open Graph metadata. |

## How the form works

`src/components/EarlyAccessForm.tsx` (client) holds the whole flow:

- **Step 1** — account type (Artist / Label / Manager, which relabels the name
  field) plus name and email. Low friction, nothing else asked.
- **Step 2** — phone (optional), Instagram, Spotify link, distributor (required),
  monthly listeners, genre, country.
- Inline per-field errors, focus moves to the first invalid field, Enter submits,
  the button disables while in flight, and the card swaps to a success state.
- A hidden `company` field is a honeypot: if it is filled the API answers `200`
  and quietly drops the submission.

`POST /api/early-access` (`src/app/api/early-access/route.ts`) re-validates every
field server-side, then fans out to two sinks in parallel:

1. an SMTP notification email to `NOTIFY_EMAIL`, and
2. the Google Sheets webhook, if configured.

If either one succeeds the lead is considered captured and the response is `200`.
Only when both fail does it return `502`, so the form can honestly tell the
visitor to retry. There is also a crude in-process rate limit of 5 submissions
per IP per 10 minutes — it resets on restart and does not span instances, so put
a real limiter in front of this if the page gets attention.

Validation rules live in `src/lib/early-access.ts` and are shared by the client
and the API route, so the two can't drift apart.

## Layout

```
src/app/layout.tsx              fonts (next/font), metadata
src/app/page.tsx                page composition + counter values
src/app/globals.css             all styling, ported from the original mockup
src/app/api/early-access/       the form endpoint
src/components/                 Nav, Hero, Features, Register, EarlyAccessForm,
                                ProgressMeter, Platforms, Closing, Footer
src/lib/early-access.ts         shared types, option lists, validation
src/lib/notify.ts               SMTP + Sheets delivery (server-only)
public/                         hero.jpg, crowd.webp, logo, favicon
legacy/                         the original HTML mockup and Python server
```

## Before launch

- The registration counter (2,847) is still a placeholder — wire
  `EARLY_ACCESS_JOINED` to the real count, or replace it with a live query.
- Hero avatar circles are initials; swap for real artist photos or drop them.
- Platform wordmarks are text; swap for official logos.
- Sign In, Privacy, Terms, Contact and the social icons are all `#` placeholders.
- Step 1 does not yet save the lead on its own — someone who abandons step 2 is
  lost. Posting a partial record on "Continue" needs the Sheet to handle an
  update-or-append, so it was left out rather than guessed at.
