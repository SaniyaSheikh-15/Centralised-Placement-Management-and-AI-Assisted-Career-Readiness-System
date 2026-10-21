import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy.engine import make_url


# Keep the existing application .env unchanged.
PROJECT_ROOT = Path(__file__).resolve().parents[2]
ENV_FILE = PROJECT_ROOT / "backend" / ".env"

load_dotenv(ENV_FILE, override=False)

database_url = os.environ.get("DATABASE_URL")
if not database_url:
    raise RuntimeError(
        f"DATABASE_URL is missing. Expected configuration in {ENV_FILE}"
    )

# Redirect tests to the dedicated database before test modules import
# backend.app.db.session or backend.app.main.
test_url = make_url(database_url).set(
    database="placement_management_test_db"
)

if test_url.database != "placement_management_test_db":
    raise RuntimeError("Refusing to run tests against an unexpected database.")

os.environ["DATABASE_URL"] = test_url.render_as_string(
    hide_password=False
)
