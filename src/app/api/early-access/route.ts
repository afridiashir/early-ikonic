import { NextResponse } from "next/server";

import { normalizeSubmission, validateSubmission } from "@/lib/early-access";
import {
  sendNotificationEmail,
  sheetConfigured,
  smtpConfigured,
  writeToSheet,
} from "@/lib/notify";

// nodemailer needs the Node runtime, and every submission must hit the network.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Crude in-process throttle: enough to blunt a script, gone on restart.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > RATE_LIMIT;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many submissions. Try again in a few minutes." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Hidden field no human fills in. Bots do — answer OK so they stop retrying.
  const honeypot = (body as Record<string, unknown>)?.company;
  if (typeof honeypot === "string" && honeypot.trim()) {
    return NextResponse.json({ ok: true, email: false, sheet: false });
  }

  const data = normalizeSubmission(body);
  const fieldErrors = validateSubmission(data);
  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      { error: "Missing or invalid fields", fieldErrors },
      { status: 400 },
    );
  }

  if (!smtpConfigured && !sheetConfigured) {
    console.error(
      "[early-access] Neither SMTP nor SHEETS_WEBHOOK_URL is configured — check .env",
    );
    return NextResponse.json({ error: "Signups are not configured yet." }, { status: 503 });
  }

  const [emailResult, sheetResult] = await Promise.allSettled([
    smtpConfigured ? sendNotificationEmail(data) : Promise.reject(new Error("SMTP not configured")),
    sheetConfigured ? writeToSheet(data) : Promise.reject(new Error("Sheet webhook not configured")),
  ]);

  const emailOk = emailResult.status === "fulfilled";
  const sheetOk = sheetResult.status === "fulfilled";

  if (!emailOk && smtpConfigured) {
    console.error("[early-access] Failed to send notification email:", emailResult.reason);
  }
  if (!sheetOk && sheetConfigured) {
    console.error("[early-access] Failed to write to Google Sheet:", sheetResult.reason);
  }

  // One sink succeeding is enough — the lead is captured either way.
  if (!emailOk && !sheetOk) {
    return NextResponse.json({ error: "Failed to process submission" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, email: emailOk, sheet: sheetOk });
}
