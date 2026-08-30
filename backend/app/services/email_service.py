import logging
import os
import smtplib
import sys
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

logger = logging.getLogger("auth_service")
logger.setLevel(logging.INFO)
if not logger.handlers:
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(logging.Formatter("[%(levelname)s] %(message)s"))
    logger.addHandler(handler)


class EmailService:

    @staticmethod
    def send_otp_email(
        to_email: str,
        otp_code: str,
        purpose: str,
    ) -> None:
        smtp_host = os.getenv("SMTP_HOST")
        smtp_port = os.getenv("SMTP_PORT")
        smtp_username = os.getenv("SMTP_USERNAME")
        smtp_password = os.getenv("SMTP_PASSWORD")
        email_from = os.getenv("EMAIL_FROM", "noreply@placementapp.com")

        if smtp_host and smtp_port and smtp_username and smtp_password:
            try:
                msg = MIMEMultipart()
                msg["From"] = email_from
                msg["To"] = to_email
                msg["Subject"] = f"Your Verification Code - {purpose.replace('_', ' ').title()}"

                body = (
                    f"Hello,\n\n"
                    f"Your 6-digit code for {purpose.replace('_', ' ')} is: {otp_code}\n\n"
                    f"This code will expire in 10 minutes. If you did not request this, please ignore this email."
                )
                msg.attach(MIMEText(body, "plain"))

                with smtplib.SMTP(smtp_host, int(smtp_port)) as server:
                    server.starttls()
                    server.login(smtp_username, smtp_password)
                    server.send_message(msg)

                print(f"[EMAIL SERVICE] OTP email sent successfully via SMTP to {to_email}", flush=True)
                return

            except Exception as exc:
                print(f"[EMAIL SERVICE ERROR] Failed to send email via SMTP: {exc}", flush=True)

        # Development Fallback: Print OTP clearly to server console
        log_message = f"[DEV EMAIL SERVICE] OTP generated for {to_email} [{purpose}]: {otp_code}"
        print(f"\n======================================================\n{log_message}\n======================================================\n", flush=True)
        logger.info(log_message)
