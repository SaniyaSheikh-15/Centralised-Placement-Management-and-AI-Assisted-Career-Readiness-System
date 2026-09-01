import smtplib
from unittest.mock import MagicMock, patch
import pytest

from backend.app.services.email_service import EmailService


def test_email_service_fallback_when_unconfigured():
    with patch.dict("os.environ", {}, clear=True):
        with patch.object(EmailService, "get_smtp_config", return_value={
            "host": None,
            "port": 587,
            "username": None,
            "password": None,
            "sender": "noreply@campusconnect.edu",
        }):
            assert EmailService.is_smtp_configured() is False
            # Should execute cleanly and log to console without error
            EmailService.send_otp_email("test@example.com", "123456", "EMAIL_VERIFICATION")


def test_email_service_smtp_send_success():
    mock_smtp_instance = MagicMock()
    mock_smtp_class = MagicMock(return_value=mock_smtp_instance)
    mock_smtp_instance.__enter__.return_value = mock_smtp_instance

    with patch.object(EmailService, "get_smtp_config", return_value={
        "host": "smtp.gmail.com",
        "port": 587,
        "username": "user@gmail.com",
        "password": "testpassword",
        "sender": "user@gmail.com",
    }):
        assert EmailService.is_smtp_configured() is True

        with patch("smtplib.SMTP", mock_smtp_class):
            EmailService.send_otp_email("recipient@example.com", "654321", "EMAIL_VERIFICATION")

            mock_smtp_class.assert_called_once_with("smtp.gmail.com", 587, timeout=15)
            mock_smtp_instance.starttls.assert_called_once()
            mock_smtp_instance.login.assert_called_once_with("user@gmail.com", "testpassword")
            mock_smtp_instance.send_message.assert_called_once()


def test_email_service_smtp_failure_raises_value_error():
    mock_smtp_instance = MagicMock()
    mock_smtp_class = MagicMock(return_value=mock_smtp_instance)
    mock_smtp_instance.__enter__.return_value = mock_smtp_instance
    mock_smtp_instance.login.side_effect = smtplib.SMTPAuthenticationError(535, b"Authentication failed")

    with patch.object(EmailService, "get_smtp_config", return_value={
        "host": "smtp.gmail.com",
        "port": 587,
        "username": "user@gmail.com",
        "password": "wrongpassword",
        "sender": "user@gmail.com",
    }):
        with patch("smtplib.SMTP", mock_smtp_class):
            with pytest.raises(ValueError) as exc_info:
                EmailService.send_otp_email("recipient@example.com", "654321", "PASSWORD_RESET")

            assert "Failed to deliver verification email" in str(exc_info.value)
