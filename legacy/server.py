"""
IKONIC Early Access — local server.
Serves the static landing page and handles form submissions:
each submission sends a formatted email notification via SMTP.

Run:  python server.py
Then open http://localhost:3000/
"""
import html
import json
import os
import smtplib
import ssl
import urllib.error
import urllib.request
from datetime import datetime, timezone
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formatdate, make_msgid
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


def load_env(path=os.path.join(BASE_DIR, ".env")):
    if not os.path.exists(path):
        return
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            os.environ.setdefault(key.strip(), value.strip())


load_env()

SMTP_HOST = os.environ.get("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "587"))
SMTP_SECURE = os.environ.get("SMTP_SECURE", "false").strip().lower() == "true"
SMTP_USER = os.environ.get("SMTP_USER", "")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD", "").replace(" ", "")
NOTIFY_EMAIL = os.environ.get("NOTIFY_EMAIL", "ahtishamlgu@gmail.com")
PORT = int(os.environ.get("PORT", "3000"))
SHEETS_WEBHOOK_URL = os.environ.get("SHEETS_WEBHOOK_URL", "")

ACCOUNT_LABELS = {"artist": "Artist", "label": "Label", "manager": "Manager"}
NAME_LABELS = {"artist": "Artist Name", "label": "Label Name", "manager": "Contact Name"}


def build_email(data):
    acct = data.get("accountType") or "artist"
    acct_label = ACCOUNT_LABELS.get(acct, "Artist")
    name_label = NAME_LABELS.get(acct, "Name")
    name = (data.get("name") or "").strip()

    rows = [
        ("Account Type", acct_label),
        (name_label, name),
        ("Email", (data.get("email") or "").strip()),
        ("Phone", (data.get("phone") or "").strip() or "Not provided"),
        ("Instagram", (data.get("instagram") or "").strip() or "Not provided"),
        ("Spotify Link", (data.get("spotify") or "").strip() or "Not provided"),
        ("Current Distributor", (data.get("distributor") or "").strip() or "Not provided"),
        ("Monthly Listeners", (data.get("listeners") or "").strip() or "Not provided"),
        ("Genre", (data.get("genre") or "").strip() or "Not provided"),
        ("Country", (data.get("country") or "").strip() or "Not provided"),
        ("Submitted At", datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")),
    ]

    subject = "[{0}] New IKONIC Early Access Signup — {1}".format(acct_label.upper(), name)

    text_body = "New IKONIC Early Access Signup ({0})\n\n".format(acct_label) + "\n".join(
        "{0}: {1}".format(k, v) for k, v in rows
    )

    row_html = "".join(
        '<tr>'
        '<td style="padding:10px 16px;color:#888;font-family:Arial,sans-serif;font-size:13px;'
        'border-bottom:1px solid #eee;white-space:nowrap;vertical-align:top">{0}</td>'
        '<td style="padding:10px 16px;color:#111;font-family:Arial,sans-serif;font-size:14px;'
        'font-weight:600;border-bottom:1px solid #eee">{1}</td>'
        '</tr>'.format(html.escape(str(k)), html.escape(str(v)))
        for k, v in rows
    )

    html_body = """\
<div style="background:#0a0a0a;padding:32px 16px;font-family:Arial,sans-serif">
  <table style="max-width:560px;width:100%;margin:0 auto;background:#ffffff;border-radius:10px;overflow:hidden;border-collapse:collapse">
    <tr><td style="background:#f5242c;padding:20px 24px">
      <span style="color:#ffffff;font-size:18px;font-weight:800;letter-spacing:.02em">IKONIC — New Early Access Signup</span>
    </td></tr>
    <tr><td style="padding:20px 24px 4px;color:#111111;font-size:15px;font-family:Arial,sans-serif">
      A new <strong>{acct_label}</strong> just joined early access.
    </td></tr>
    <tr><td style="padding:8px 8px 24px">
      <table style="width:100%;border-collapse:collapse">{rows}</table>
    </td></tr>
  </table>
</div>""".format(acct_label=html.escape(acct_label), rows=row_html)

    return subject, text_body, html_body


def send_notification_email(data):
    subject, text_body, html_body = build_email(data)

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = SMTP_USER
    msg["To"] = NOTIFY_EMAIL
    msg["Date"] = formatdate(localtime=True)
    msg["Message-ID"] = make_msgid(domain="ikonicdistro.com")
    msg.attach(MIMEText(text_body, "plain"))
    msg.attach(MIMEText(html_body, "html"))

    context = ssl.create_default_context()
    if SMTP_SECURE:
        with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, context=context) as server:
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)
    else:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls(context=context)
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)


def write_to_sheet(data):
    if not SHEETS_WEBHOOK_URL:
        raise RuntimeError("SHEETS_WEBHOOK_URL not configured")
    payload = json.dumps(data).encode("utf-8")
    req = urllib.request.Request(
        SHEETS_WEBHOOK_URL,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=10) as resp:
        resp.read()


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def log_message(self, fmt, *args):
        print("[server]", fmt % args)

    def _send_json(self, status, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path == "/":
            self.path = "/early-access-landing-page.html"
        return super().do_GET()

    def do_POST(self):
        if self.path != "/api/early-access":
            self._send_json(404, {"error": "Not found"})
            return

        try:
            length = int(self.headers.get("Content-Length", 0))
            raw = self.rfile.read(length)
            data = json.loads(raw.decode("utf-8"))
        except Exception:
            self._send_json(400, {"error": "Invalid request body"})
            return

        name = (data.get("name") or "").strip()
        email = (data.get("email") or "").strip()
        distributor = (data.get("distributor") or "").strip()
        if not name or not email or "@" not in email or not distributor:
            self._send_json(400, {"error": "Missing required fields"})
            return

        email_ok = False
        if not SMTP_USER or not SMTP_PASSWORD:
            print("[server] SMTP_USER / SMTP_PASSWORD not configured — check .env")
        else:
            try:
                send_notification_email(data)
                email_ok = True
            except Exception as exc:
                print("[server] Failed to send notification email:", exc)

        sheet_ok = False
        try:
            write_to_sheet(data)
            sheet_ok = True
        except Exception as exc:
            print("[server] Failed to write to Google Sheet:", exc)

        if not email_ok and not sheet_ok:
            self._send_json(502, {"error": "Failed to process submission"})
            return

        self._send_json(200, {"ok": True, "email": email_ok, "sheet": sheet_ok})


def main():
    server = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    print("IKONIC early access server running at http://localhost:{0}/".format(PORT))
    print("Notification emails will be sent to:", NOTIFY_EMAIL)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.shutdown()


if __name__ == "__main__":
    main()
