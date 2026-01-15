from app.schemas.travel_signal import Signal
from datetime import datetime

CITY_FLIGHT_INDEX = {
    "tokyo": 65,
    "osaka": 65,
    "seoul": 70,
    "singapore": 75,
    "bangkok": 80,
    "dubai": 78,
    "paris": 60,
    "london": 58,
    "berlin": 62,
    "rome": 64,
    "new york": 55,
    "mumbai": 85,
    "delhi": 85,
    "kathmandu": 82,
    "beijing": 68,
}

def season_adjustment(start_date: str) -> int:
    month = datetime.fromisoformat(start_date).month

    # Peak travel months
    if month in [6, 7, 8, 12]:
        return -10
    # Shoulder season
    if month in [3, 4, 9, 10]:
        return 0
    # Off-season
    return +5

async def get_flights(destination: str, start_date: str):
    base_score = CITY_FLIGHT_INDEX.get(destination.lower(), 60)
    adjustment = season_adjustment(start_date)

    final_score = max(0, min(100, base_score + adjustment))

    summary = (
        "Flight prices are affordable"
        if final_score >= 75
        else "Flight prices are moderate"
        if final_score >= 60
        else "Flight prices are expensive"
    )

    return Signal(
        score=final_score,
        summary=summary,
        source="Heuristic Flight Model"
    )
