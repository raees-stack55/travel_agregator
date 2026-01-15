from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router

app = FastAPI(
    title="Travel Signals Aggregator",
    description="Aggregates multiple travel signals to assess trip feasibility",
    version="1.0.0",
)

# Allow local frontend dev servers to call the API
app.add_middleware(
    CORSMiddleware,
    # Allow any local dev origin; tighten later if needed
    allow_origins=["*"],
    allow_origin_regex=".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
