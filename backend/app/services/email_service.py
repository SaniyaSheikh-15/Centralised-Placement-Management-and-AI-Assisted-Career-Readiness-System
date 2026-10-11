import logging
import os
import smtplib
import sys
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from backend.app.core.config import (
    EMAIL_FROM,
    SMTP_HOST,
    SMTP_PASSWORD,
    SMTP_PORT,
    SMTP_USERNAME,
)

logger = logging.getLogger("auth_service")
logger.setLevel(logging.INFO)
if not logger.handlers:
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(logging.Formatter("[%(levelname)s] %(message)s"))
    logger.addHandler(handler)


class EmailService:

    @staticmethod
    def get_smtp_config() -> dict[str, str | int | None]:
        """Fetch current SMTP settings from config/environment."""
        host = os.getenv("SMTP_HOST") or SMTP_HOST
        port_raw = os.getenv("SMTP_PORT") or SMTP_PORT
        username = os.getenv("SMTP_USERNAME") or SMTP_USERNAME
        password = os.getenv("SMTP_PASSWORD") or SMTP_PASSWORD
        sender = os.getenv("EMAIL_FROM") or EMAIL_FROM or username or "noreply@campusconnect.edu"

        port = int(port_raw) if port_raw else 587
        return {
            "host": host,
            "port": port,
            "username": username,
            "password": password,
            "sender": sender,
        }

    @classmethod
    def is_smtp_configured(cls) -> bool:
        """Check if all required SMTP credentials are present."""
        cfg = cls.get_smtp_config()
        return bool(cfg["host"] and cfg["port"] and cfg["username"] and cfg["password"])

    @classmethod
    def send_otp_email(
        cls,
        to_email: str,
        otp_code: str,
        purpose: str,
    ) -> None:
        """
        Deliver a 6-digit OTP verification code to the recipient.
        
        - If SMTP is configured: sends a formatted email via SMTP with STARTTLS.
        - If SMTP is not configured: logs the OTP to backend server logs (development fallback).
        """
        cfg = cls.get_smtp_config()
        purpose_title = purpose.replace("_", " ").title()

        if cls.is_smtp_configured():
            try:
                msg = MIMEMultipart("alternative")
                msg["From"] = cfg["sender"]
                msg["To"] = to_email
                msg["Subject"] = f"CampusConnect - Your {purpose_title} Verification Code"

                plain_text = (
                    f"Hello,\n\n"
                    f"Your 6-digit verification code for {purpose_title} is:\n\n"
                    f"    {otp_code}\n\n"
                    f"This code will expire in 10 minutes.\n"
                    f"If you did not request this code, please ignore this email and protect your account.\n\n"
                    f"— CampusConnect Placement & Career Readiness Team"
                )

                html_body = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b1526; color: #f4f7fb; margin: 0; padding: 24px; }}
    .container {{ background-color: #0f1c2e; border: 1px solid #1b304b; border-radius: 14px; max-width: 480px; margin: 0 auto; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.35); }}
    .brand {{ color: #4b94ff; font-weight: 800; font-size: 22px; text-align: center; margin-bottom: 20px; letter-spacing: 0.5px; }}
    .title {{ font-size: 20px; font-weight: 700; color: #ffffff; text-align: center; margin-bottom: 12px; }}
    .text {{ font-size: 14px; color: #8fa2bb; text-align: center; line-height: 1.6; margin-bottom: 20px; }}
    .otp-box {{ background: rgba(35, 124, 255, 0.12); border: 1px dashed rgba(61, 140, 255, 0.4); border-radius: 10px; padding: 16px; text-align: center; margin: 24px 0; }}
    .otp-code {{ font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #4b94ff; font-family: 'Courier New', Courier, monospace; }}
    .expiry {{ font-size: 13px; color: #8fa2bb; text-align: center; margin-top: 16px; }}
    .footer {{ font-size: 11px; color: #61748c; text-align: center; margin-top: 28px; border-top: 1px solid #1b304b; padding-top: 16px; line-height: 1.5; }}
  </style>
</head>
<body>
  <div class="container">
    <div class="brand">CampusConnect</div>
    <div class="title">{purpose_title}</div>
    <p class="text">Please enter the following 6-digit verification code to complete your request:</p>
    <div class="otp-box">
      <div class="otp-code">{otp_code}</div>
    </div>
    <p class="expiry">This verification code is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
    <div class="footer">If you did not request this email, please disregard it.<br>&copy; Centralised Placement Management &amp; AI-Assisted Career Readiness System</div>
  </div>
</body>
</html>"""

                msg.attach(MIMEText(plain_text, "plain", "utf-8"))
                msg.attach(MIMEText(html_body, "html", "utf-8"))

                with smtplib.SMTP(str(cfg["host"]), int(cfg["port"]), timeout=15) as server:
                    server.starttls()
                    server.login(str(cfg["username"]), str(cfg["password"]))
                    server.send_message(msg)

                logger.info(f"[EMAIL SERVICE] OTP email for {purpose} sent successfully via SMTP to {to_email}")
                print(f"[EMAIL SERVICE] OTP email sent successfully via SMTP to {to_email}", flush=True)
                return

            except (smtplib.SMTPException, OSError) as exc:
                logger.error(f"[EMAIL SERVICE ERROR] Failed to send email via SMTP to {to_email}: {exc}")
                print(f"[EMAIL SERVICE ERROR] Failed to send email via SMTP to {to_email}: {exc}", flush=True)
                raise ValueError(
                    "Failed to deliver verification email. Please verify your email address or SMTP configuration."
                ) from exc

        # Development Fallback: Print OTP clearly to server console
        log_message = f"[DEV EMAIL SERVICE] OTP generated for {to_email} [{purpose}]: {otp_code}"
        print(f"\n======================================================\n{log_message}\n======================================================\n", flush=True)
        logger.info(log_message)

