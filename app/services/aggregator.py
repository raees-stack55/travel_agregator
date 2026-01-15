import asyncio
from typing import Dict, List, Tuple

from app.adapters.weather import get_weather          # async
from app.adapters.holidays import fetch_public_holidays  # sync
from app.adapters.currency import get_currency        # sync
from app.adapters.safety import get_safety            # async
from app.adapters.flights import get_flights          # async
from app.schemas.travel_signal import Signal


async def aggregate_signals(
    destination: str,
    start_date: str,
    end_date: str
) -> Tuple[Dict[str, Signal], List[str]]:
    """
    Fetch all travel signals concurrently.
    Handles both async and sync adapters safely.
    """

    tasks = {
        # async adapters
        "weather": get_weather(destination, start_date, end_date),
        "safety": get_safety(destination),
        "flights": get_flights(destination, start_date),

        # sync adapters → run in thread pool
        "holidays": asyncio.to_thread(
            fetch_public_holidays, destination, start_date, end_date
        ),
        "currency": asyncio.to_thread(
            get_currency, destination
        ),
    }

    results = await asyncio.gather(
        *tasks.values(),
        return_exceptions=True
    )

    signals: Dict[str, Signal] = {}
    missing_signals: List[str] = []

    for key, result in zip(tasks.keys(), results):
        if isinstance(result, Exception):
            print(f"{key} signal error:", result)
            missing_signals.append(key)
        elif result is None:
            missing_signals.append(key)
        else:
            signals[key] = result

    return signals, missing_signals
