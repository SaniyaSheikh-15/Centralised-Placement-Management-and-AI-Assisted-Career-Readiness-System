import pytest
from fastapi.testclient import TestClient

from backend.app.db.session import engine
from backend.app.main import app


client = TestClient(app, raise_server_exceptions=False)

ANALYTICS_ENDPOINTS = [
    "/analytics/overview",
    "/analytics/placements",
    "/analytics/applications",
    "/analytics/hiring-trends",
    "/analytics/department-wise",
    "/analytics/branch-wise",
    "/analytics/year-wise",
    "/analytics/company-wise",
    "/analytics/eligible-students",
    "/analytics/salary-distribution",
    "/analytics/role-offers",
    "/analytics/company-recruitment-trends",
    "/analytics/hiring-updates",
    "/analytics/drive-statistics",
]


def test_analytics_tests_use_isolated_database():
    assert engine.url.database == "placement_management_test_db", (
        "Refusing to run Analytics tests: the active database is not "
        "placement_management_test_db."
    )


@pytest.mark.parametrize("endpoint", ANALYTICS_ENDPOINTS)
def test_analytics_endpoint_returns_success(endpoint):
    response = client.get(endpoint)

    assert response.status_code == 200, (
        f"{endpoint} returned HTTP {response.status_code}: "
        f"{response.text[:2000]}"
    )
