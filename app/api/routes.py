from fastapi import APIRouter
from app.core.config import OPENWEATHER_API_KEY
from fastapi import APIRouter, Query
from app.services.aggregator import aggregate_signals
from app.services.scorer import calculate_total_score
from app.schemas.travel_signal import TravelResponse

router = APIRouter()

@router.get("/health")
# def health_check():
#     return {
#         "status": "ok",
#         "weather_key_loaded": OPENWEATHER_API_KEY is not None
#     }

def health_check():
    return {"status": "ok"}

@router.get("/travel-signal", response_model=TravelResponse)
async def get_travel_signal(
    destination: str = Query(..., example="Tokyo"),
    start_date: str = Query(..., example="2026-03-10"),
    end_date: str = Query(..., example="2026-03-20"),
):
    signals, missing_signals = await aggregate_signals(
        destination, start_date, end_date
    )

    total_score = calculate_total_score(signals)

    return {
        "destination": destination,
        "start_date": start_date,
        "end_date": end_date,
        "total_score": total_score,
        "signals": signals,
        "missing_signals": missing_signals
    }


# from app.schemas.travel_signal import Signal, TravelResponse

# @router.get("/schema-test", response_model=TravelResponse)
# def schema_test():
#     return {
#         "destination": "Tokyo",
#         "start_date": "2026-03-10",
#         "end_date": "2026-03-20",
#         "total_score": 85,
#         "signals": {
#             "weather": {
#                 "score": 80,
#                 "summary": "Pleasant weather",
#                 "source": "OpenWeatherMap"
#             }
#         },
#         "missing_signals": ["flights"]
#     }

# from app.services.aggregator import aggregate_signals

# @router.get("/aggregate-test")
# async def aggregate_test(
#     destination: str = "Tokyo",
#     start_date: str = "2026-03-10",
#     end_date: str = "2026-03-20"
# ):
#     signals, missing = await aggregate_signals(destination, start_date, end_date)
#     return {
#         "signals": signals,
#         "missing_signals": missing
#     }


# from app.services.scorer import calculate_total_score
# from app.schemas.travel_signal import Signal

# @router.get("/score-test")
# def score_test():
#     signals = {
#         "weather": Signal(score=80, summary="", source=""),
#         "safety": Signal(score=90, summary="", source=""),
#         "currency": Signal(score=70, summary="", source="")
#     }
#     return {"total_score": calculate_total_score(signals)}
