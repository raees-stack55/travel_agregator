from app.schemas.travel_signal import Signal

# Static country risk index (0 = safest, 5 = dangerous)
COUNTRY_SAFETY_INDEX = {
    "JP": (1.2, "Exercise normal safety precautions."),
    "SG": (1.0, "Very safe destination with low crime."),
    "KR": (1.3, "Generally safe with standard precautions."),
    "IN": (2.8, "Exercise increased caution in crowded areas."),
    "US": (2.5, "Exercise increased caution due to crime."),
    "FR": (2.3, "Exercise increased caution due to terrorism."),
    "GB": (2.1, "Exercise normal caution."),
    "DE": (1.8, "Generally safe destination."),
    "IT": (2.0, "Exercise normal precautions."),
    "AE": (1.4, "Low crime, very safe destination."),
    "TH": (2.6, "Exercise increased caution."),
    "CN": (2.2, "Exercise normal precautions."),
    "NP": (2.4, "Exercise increased caution in remote areas."),
}

CITY_TO_COUNTRY = {
    "tokyo": "JP",
    "osaka": "JP",
    "kyoto": "JP",
    "singapore": "SG",
    "seoul": "KR",
    "mumbai": "IN",
    "delhi": "IN",
    "paris": "FR",
    "london": "GB",
    "new york": "US",
    "berlin": "DE",
    "rome": "IT",
    "dubai": "AE",
    "bangkok": "TH",
    "beijing": "CN",
    "kathmandu": "NP",
}

async def get_safety(destination: str):
    """
    Safety signal using curated country risk index.
    This is a stable fallback due to unreliable public APIs.
    """
    country_code = CITY_TO_COUNTRY.get(destination.lower())
    if not country_code:
        return None

    advisory = COUNTRY_SAFETY_INDEX.get(country_code)
    if not advisory:
        return None

    advisory_score, message = advisory

    # Convert 1–5 risk scale to 0–100 safety score
    score = int(max(0, min(100, (5 - advisory_score) * 20)))

    return Signal(
        score=score,
        summary=message,
        source="Country Risk Dataset (Fallback)"
    )
