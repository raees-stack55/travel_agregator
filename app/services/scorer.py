from typing import Dict
from app.schemas.travel_signal import Signal

WEIGHTS = {
    "weather": 0.30,
    "safety": 0.25,
    "currency": 0.20,
    "holidays": 0.15,
    "flights": 0.10
}


def calculate_total_score(signals: Dict[str, Signal]) -> int:
    """
    Calculate weighted travel feasibility score.
    Missing signals are ignored and weights are normalized.
    """

    if not signals:
        return 0

    total_weight = 0.0
    weighted_score = 0.0

    for key, signal in signals.items():
        weight = WEIGHTS.get(key)
        if weight:
            weighted_score += signal.score * weight
            total_weight += weight

    if total_weight == 0:
        return 0

    # Normalize score if some signals are missing
    final_score = weighted_score / total_weight
    return int(final_score)
