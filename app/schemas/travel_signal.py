from pydantic import BaseModel
from typing import Optional, Dict, List

class Signal(BaseModel):
    score: int
    summary: str
    source: str

class TravelResponse(BaseModel):
    destination: str
    start_date: str
    end_date: str
    total_score: int
    signals: Dict[str, Signal]
    missing_signals: List[str]
