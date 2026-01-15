import httpx
from app.schemas.travel_signal import Signal
from app.core.config import OPENWEATHER_API_KEY


async def get_weather(destination: str, start_date: str, end_date: str) -> Signal | None:
    if not OPENWEATHER_API_KEY:
        return None

    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {
        "q": destination,
        "appid": OPENWEATHER_API_KEY,
        "units": "metric"
    }

    try:
        async with httpx.AsyncClient(timeout=5) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()

        temp = data["main"]["temp"]
        weather_desc = data["weather"][0]["description"]

        # Simple scoring logic (explainable)
        if 18 <= temp <= 28:
            score = 85
        elif 10 <= temp < 18 or 28 < temp <= 35:
            score = 70
        else:
            score = 50

        summary = f"Current temperature {temp}°C with {weather_desc}"

        return Signal(
            score=score,
            summary=summary,
            source="OpenWeatherMap"
        )

    except Exception as e:
        print("Weather API error:", e)
        return None

