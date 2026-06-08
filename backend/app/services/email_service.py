"""
EmailService abstraction.

To send real emails, set these environment variables (all optional):

    SMTP_HOST      SMTP server hostname          e.g. smtp.gmail.com
    SMTP_PORT      SMTP port (default 587)       465 for SSL, 587 for STARTTLS
    SMTP_USER      Login username                e.g. you@gmail.com
    SMTP_PASSWORD  Login password / App Password (see README)
    SMTP_FROM      Sender address (default: same as SMTP_USER)

If SMTP_HOST is not set, messages are printed to stdout only (dev fallback).

Gmail quick-start
─────────────────
  1. Enable 2-Step Verification on your Google account.
  2. Go to  myaccount.google.com → Security → App Passwords
  3. Create an App Password (select "Mail" + "Other").
  4. Set the env vars:
       SMTP_HOST=smtp.gmail.com
       SMTP_PORT=587
       SMTP_USER=you@gmail.com
       SMTP_PASSWORD=xxxx xxxx xxxx xxxx   ← 16-char App Password
"""
import logging
import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Protocol, runtime_checkable

log = logging.getLogger(__name__)


@runtime_checkable
class EmailService(Protocol):
    def send(self, *, to: str, subject: str, body: str, reply_to: str = "") -> bool: ...


# ── Log-only (dev fallback) ───────────────────────────────────────────────────

class LogEmailService:
    """Writes the message to stdout. Set SMTP_HOST to send real emails."""

    def send(self, *, to: str, subject: str, body: str, reply_to: str = "") -> bool:
        separator = "-" * 50
        print(f"\n{separator}")
        print(f"  [CONTACT FORM] message received (SMTP not configured, not sent)")
        print(separator)
        print(f"  To:       {to}")
        print(f"  Reply-To: {reply_to or '(none)'}")
        print(f"  Subject:  {subject}")
        print(f"\n{body}")
        print(separator + "\n")
        log.info("Contact form message logged to stdout (SMTP_HOST not set).")
        return True


# ── SMTP ─────────────────────────────────────────────────────────────────────

class SmtpEmailService:
    def __init__(
        self,
        host: str,
        port: int = 587,
        user: str = "",
        password: str = "",
        sender: str = "",     # defaults to user if blank
        use_ssl: bool = False,
    ) -> None:
        self._host    = host
        self._port    = port
        self._user    = user
        self._password = password
        self._sender  = sender or user   # Gmail requires From == authenticated account
        self._use_ssl = use_ssl

    def send(self, *, to: str, subject: str, body: str, reply_to: str = "") -> bool:
        try:
            msg = MIMEMultipart("alternative")
            msg["From"]    = self._sender
            msg["To"]      = to
            msg["Subject"] = subject
            if reply_to:
                msg["Reply-To"] = reply_to
            msg.attach(MIMEText(body, "plain", "utf-8"))

            if self._use_ssl:
                # Port 465 — direct SSL connection
                with smtplib.SMTP_SSL(self._host, self._port) as server:
                    if self._user:
                        server.login(self._user, self._password)
                    server.sendmail(self._sender, [to], msg.as_string())
            else:
                # Port 587 — STARTTLS upgrade
                with smtplib.SMTP(self._host, self._port) as server:
                    server.ehlo()
                    server.starttls()
                    server.ehlo()
                    if self._user:
                        server.login(self._user, self._password)
                    server.sendmail(self._sender, [to], msg.as_string())

            log.info("Email sent to %s (subject: %s)", to, subject)
            return True

        except smtplib.SMTPAuthenticationError:
            log.error(
                "SMTP authentication failed for %s. "
                "For Gmail: use an App Password, not your regular password. "
                "See: myaccount.google.com → Security → App Passwords",
                self._user,
            )
            return False
        except Exception as exc:
            log.error("SMTP send failed: %s", exc)
            return False


# ── Factory ───────────────────────────────────────────────────────────────────

def build_email_service() -> EmailService:
    host = os.getenv("SMTP_HOST", "").strip()
    if not host:
        log.warning(
            "SMTP_HOST is not set — using LogEmailService. "
            "Messages will be printed to stdout only. "
            "Set SMTP_HOST (and SMTP_USER / SMTP_PASSWORD) to send real emails."
        )
        return LogEmailService()

    port     = int(os.getenv("SMTP_PORT", "587"))
    user     = os.getenv("SMTP_USER", "").strip()
    password = os.getenv("SMTP_PASSWORD", "").strip()
    sender   = os.getenv("SMTP_FROM", "").strip()
    use_ssl  = port == 465

    log.info(
        "SMTP configured: host=%s port=%d user=%s ssl=%s",
        host, port, user or "(anonymous)", use_ssl,
    )

    return SmtpEmailService(
        host=host,
        port=port,
        user=user,
        password=password,
        sender=sender,
        use_ssl=use_ssl,
    )
