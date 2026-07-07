import pytest
from httpx import ASGITransport, AsyncClient
from app.main import app

# For testing, we can run against the running instance or use FastAPI's test client.
# Since we have async db session, we can do direct calls via httpx.AsyncClient.
# We'll mock/test endpoints against a test instance of the app.

@pytest.mark.asyncio
async def test_health_check():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

@pytest.mark.asyncio
async def test_auth_and_dashboard():
    from app.db.session import engine
    try:
        # We will test the login and dashboard API flow
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            # 1. Login with seeded user Aarav Sharma
            login_response = await ac.post("/auth/login", json={
                "email": "aarav.sharma@idbi.co.in",
                "password": "demo1234"
            })
            assert login_response.status_code == 200
            tokens = login_response.json()
            assert "access_token" in tokens
            assert "refresh_token" in tokens
            
            access_token = tokens["access_token"]
            headers = {"Authorization": f"Bearer {access_token}"}
            
            # 2. Get Dashboard data
            dashboard_response = await ac.get("/dashboard", headers=headers)
            assert dashboard_response.status_code == 200
            dashboard_data = dashboard_response.json()
            assert "balance" in dashboard_data
            assert "accounts" in dashboard_data
            assert "recent_transactions" in dashboard_data
            assert "ai_insight" in dashboard_data
            assert "upcoming_life_event" in dashboard_data
            
            # 3. Get Life Events
            events_response = await ac.get("/life-events", headers=headers)
            assert events_response.status_code == 200
            events = events_response.json()
            assert len(events) > 0
            assert events[0]["title"] == "Home Purchase"
            
            # 4. Get Offers
            offers_response = await ac.get("/offers", headers=headers)
            assert offers_response.status_code == 200
            offers = offers_response.json()
            assert len(offers) > 0
            
            # 5. Get Settings
            settings_response = await ac.get("/settings", headers=headers)
            assert settings_response.status_code == 200
            settings_data = settings_response.json()
            assert settings_data["language"] == "English"
            
            # 6. Update Settings
            update_response = await ac.put("/settings", json={
                "language": "Hindi",
                "notifications_enabled": False,
                "biometrics_enabled": True
            }, headers=headers)
            assert update_response.status_code == 200
            assert update_response.json()["language"] == "Hindi"
            
            # Clean up settings back to English for future runs
            await ac.put("/settings", json={
                "language": "English",
                "notifications_enabled": True,
                "biometrics_enabled": False
            }, headers=headers)
    finally:
        await engine.dispose()

@pytest.mark.asyncio
async def test_explain_future_you():
    from app.db.session import engine
    try:
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            # Login
            login_response = await ac.post("/auth/login", json={
                "email": "aarav.sharma@idbi.co.in",
                "password": "demo1234"
            })
            assert login_response.status_code == 200
            tokens = login_response.json()
            headers = {"Authorization": f"Bearer {tokens['access_token']}"}
            
            # Request explanation
            response = await ac.get("/money-mood/explain-future-you", headers=headers)
            assert response.status_code == 200
            data = response.json()
            assert "why" in data
            assert "how" in data
            assert isinstance(data["how"], list)
            assert len(data["how"]) >= 2
    finally:
        await engine.dispose()

