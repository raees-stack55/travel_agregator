import requests
from app.schemas.travel_signal import Signal

COUNTRY_TO_CURRENCY = {
    "JP": "JPY",
    "FR": "EUR",
    "GB": "GBP",
    "US": "USD",
    "DE": "EUR",
    "IT": "EUR",
    "IN": "INR",
    "AU": "AUD",
    "CA": "CAD",
    "SG": "SGD",
    "AE": "AED",
    "ES": "EUR",
    "NL": "EUR",
    "CH": "CHF",
    "TH": "THB",
    "KR": "KRW",
    "CN": "CNY",
    "NP": "NPR"
}

CITY_TO_COUNTRY = {
    # reuse same mapping as holidays
    "tokyo": "JP",
    "paris": "FR",
    "london": "GB",
    "new york": "US",
    "berlin": "DE",
    "rome": "IT",
    "mumbai": "IN",
    "sydney": "AU",
    "toronto": "CA",
    "singapore": "SG",
    "dubai": "AE",
    "bangkok": "TH",
    "seoul": "KR",
    "beijing": "CN",
    "kathmandu": "NP"
}


BASE_CURRENCY = "INR"

def get_currency(destination: str):
    try:
        country = CITY_TO_COUNTRY.get(destination.lower())
        if not country:
            return None

        dest_currency = COUNTRY_TO_CURRENCY.get(country)
        if not dest_currency or dest_currency == BASE_CURRENCY:
            return Signal(
                score=90,
                summary="Local currency matches base currency",
                source="Frankfurter API"
            )

        url = f"https://api.frankfurter.app/latest?from={BASE_CURRENCY}&to={dest_currency}"
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        data = response.json()

        rate = data["rates"][dest_currency]

        # Simple cost heuristic
        if rate > 1:
            score = 40
            cost_label = "expensive"
        elif rate > 0.5:
            score = 60
            cost_label = "moderate"
        else:
            score = 80
            cost_label = "affordable"

        return Signal(
            score=score,
            summary=f"Destination currency ({dest_currency}) is {cost_label} compared to INR",
            source="Frankfurter API"
        )

    except Exception as e:
        print("Currency API error:", e)
        return None
