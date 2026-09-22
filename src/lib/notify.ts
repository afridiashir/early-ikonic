import "server-only";

import nodemailer from "nodemailer";

import {
  ACCOUNT_LABELS,
  NAME_LABELS,
  type EarlyAccessSubmission,
} from "@/lib/early-access";

const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_SECURE = (process.env.SMTP_SECURE || "false").trim().toLowerCase() === "true";
const SMTP_USER = process.env.SMTP_USER || "";
// App passwords are usually shown in space-separated groups; strip them.
const SMTP_PASSWORD = (process.env.SMTP_PASSWORD || "").replace(/\s/g, "");
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || "";
const SHEETS_WEBHOOK_URL = process.env.SHEETS_WEBHOOK_URL || "";

export const smtpConfigured = Boolean(SMTP_USER && SMTP_PASSWORD && NOTIFY_EMAIL);
export const sheetConfigured = Boolean(SHEETS_WEBHOOK_URL);

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function submissionRows(data: EarlyAccessSubmission): [string, string][] {
  const acctLabel = ACCOUNT_LABELS[data.accountType];
  const or = (value: string) => value || "Not provided";

  return [
    ["Account Type", acctLabel],
    [NAME_LABELS[data.accountType], data.name],
    ["Email", data.email],
    ["Phone", or(data.phone)],
    ["Instagram", or(data.instagram)],
    ["Spotify Link", or(data.spotify)],
    ["Current Distributor", or(data.distributor)],
    ["Monthly Listeners", or(data.listeners)],
    ["Genre", or(data.genre)],
    ["Country", or(data.country)],
    ["Submitted At", `${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC`],
  ];
}

export function buildEmail(data: EarlyAccessSubmission) {
  const acctLabel = ACCOUNT_LABELS[data.accountType];
  const rows = submissionRows(data);

  const subject = `[${acctLabel.toUpperCase()}] New IKONIC Early Access Signup — ${data.name}`;

  const text =
    `New IKONIC Early Access Signup (${acctLabel})\n\n` +
    rows.map(([k, v]) => `${k}: ${v}`).join("\n");

  const rowHtml = rows
    .map(
      ([k, v]) =>
        '<tr>' +
        '<td style="padding:10px 16px;color:#888;font-family:Arial,sans-serif;font-size:13px;' +
        `border-bottom:1px solid #eee;white-space:nowrap;vertical-align:top">${escapeHtml(k)}</td>` +
        '<td style="padding:10px 16px;color:#111;font-family:Arial,sans-serif;font-size:14px;' +
        `font-weight:600;border-bottom:1px solid #eee">${escapeHtml(v)}</td>` +
        '</tr>',
    )
    .join("");

  const html = `<div style="background:#0a0a0a;padding:32px 16px;font-family:Arial,sans-serif">
  <table style="max-width:560px;width:100%;margin:0 auto;background:#ffffff;border-radius:10px;overflow:hidden;border-collapse:collapse">
    <tr><td style="background:#f5242c;padding:20px 24px">
      <span style="color:#ffffff;font-size:18px;font-weight:800;letter-spacing:.02em">IKONIC — New Early Access Signup</span>
    </td></tr>
    <tr><td style="padding:20px 24px 4px;color:#111111;font-size:15px;font-family:Arial,sans-serif">
      A new <strong>${escapeHtml(acctLabel)}</strong> just joined early access.
    </td></tr>
    <tr><td style="padding:8px 8px 24px">
      <table style="width:100%;border-collapse:collapse">${rowHtml}</table>
    </td></tr>
  </table>
</div>`;

  return { subject, text, html };
}

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE, // false → STARTTLS on port 587
      auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
    });
  }
  return transporter;
}

export async function sendNotificationEmail(data: EarlyAccessSubmission) {
  const { subject, text, html } = buildEmail(data);
  await getTransporter().sendMail({
    from: `"IKONIC Early Access" <${SMTP_USER}>`,
    to: NOTIFY_EMAIL,
    replyTo: data.email || undefined,
    subject,
    text,
    html,
  });
}

export async function writeToSheet(data: EarlyAccessSubmission) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch(SHEETS_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        submittedAt: new Date().toISOString(),
      }),
      signal: controller.signal,
      // Apps Script webhooks answer with a 302 to script.googleusercontent.com.
      redirect: "follow",
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`Sheet webhook responded ${res.status}`);
    }
  } finally {
    clearTimeout(timeout);
  }
}
