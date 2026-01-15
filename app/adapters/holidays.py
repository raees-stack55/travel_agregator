import requests
from datetime import datetime
from app.schemas.travel_signal import Signal

CITY_TO_COUNTRY = {
    # Japan
    "tokyo": "JP",
    "osaka": "JP",
    "kyoto": "JP",

    # France
    "paris": "FR",
    "lyon": "FR",
    "nice": "FR",

    # United Kingdom
    "london": "GB",
    "manchester": "GB",
    "birmingham": "GB",

    # United States
    "new york": "US",
    "los angeles": "US",
    "san francisco": "US",
    "chicago": "US",
    "miami": "US",

    # Germany
    "berlin": "DE",
    "munich": "DE",
    "hamburg": "DE",

    # Italy
    "rome": "IT",
    "milan": "IT",
    "venice": "IT",

    # India
    "mumbai": "IN",
    "delhi": "IN",
    "bangalore": "IN",
    "chennai": "IN",
    "hyderabad": "IN",
    "pune": "IN",

    # Australia
    "sydney": "AU",
    "melbourne": "AU",
    "brisbane": "AU",

    # Canada
    "toronto": "CA",
    "vancouver": "CA",
    "montreal": "CA",

    # Singapore
    "singapore": "SG",

    # UAE
    "dubai": "AE",
    "abu dhabi": "AE",

    # Spain
    "madrid": "ES",
    "barcelona": "ES",

    # Netherlands
    "amsterdam": "NL",

    # Switzerland
    "zurich": "CH",
    "geneva": "CH",

    # Thailand
    "bangkok": "TH",

    # South Korea
    "seoul": "KR",

    # China
    "beijing": "CN",
    "shanghai": "CN",

    # Nepal
    "kathmandu": "NP"
}


def fetch_public_holidays(destination: str, start_date: str, end_date: str):
    try:
        country_code = CITY_TO_COUNTRY.get(destination.lower())
        if not country_code:
            return None

        year = datetime.fromisoformat(start_date).year
        url = f"https://date.nager.at/api/v3/PublicHolidays/{year}/{country_code}"

        response = requests.get(url, timeout=5)

        # ✅ Handle "No Content"
        if response.status_code == 204:
            holidays = []
        else:
            response.raise_for_status()
            holidays = response.json()

        start = datetime.fromisoformat(start_date).date()
        end = datetime.fromisoformat(end_date).date()

        trip_holidays = [
            h for h in holidays
            if start <= datetime.fromisoformat(h["date"]).date() <= end
        ]

        count = len(trip_holidays)
        score = 100 - min(count * 20, 60)

        return Signal(
            score=score,
            summary=f"{count} public holidays may increase crowd levels",
            source="Nager.Date API"
        )

    except Exception as e:
        print("Holiday API error:", e)
        return None
