# Travel Signals Aggregator

A smart travel planning application that aggregates multiple data sources to provide comprehensive travel feasibility analysis. Get instant insights on weather conditions, safety advisories, flight pricing trends, public holidays, and currency exchange rates for your next trip.

## Overview

This project consists of a FastAPI backend that aggregates travel signals from various APIs and a React frontend that displays the results in an intuitive, modern interface. The system calculates an overall feasibility score based on weighted signals to help travelers make informed decisions.

## Tech Stack

### Backend
- **Python 3.13**
- **FastAPI** - Modern, fast web framework for building APIs
- **Pydantic** - Data validation using Python type annotations
- **httpx** - Async HTTP client for API calls
- **Uvicorn** - ASGI server for running FastAPI
- **python-dotenv** - Environment variable management

### Frontend
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **date-fns** - Date utility library

## Project Structure

```
travel-signals-aggregator/
├── app/                    # Backend application
│   ├── adapters/          # API adapters for each signal
│   │   ├── weather.py     # OpenWeatherMap integration
│   │   ├── safety.py      # Safety risk data
│   │   ├── flights.py     # Flight pricing heuristics
│   │   ├── holidays.py    # Public holidays API
│   │   └── currency.py    # Currency exchange API
│   ├── api/               # API routes
│   │   └── routes.py      # FastAPI endpoints
│   ├── core/              # Core configuration
│   │   └── config.py      # Environment config
│   ├── schemas/           # Pydantic models
│   │   └── travel_signal.py
│   ├── services/          # Business logic
│   │   ├── aggregator.py  # Signal aggregation
│   │   └── scorer.py      # Score calculation
│   └── main.py            # FastAPI app entry point
├── Voyage-Planner/        # Frontend application
│   └── client/
│       └── src/
│           ├── components/ # React components
│           ├── pages/     # Page components
│           └── lib/       # Utilities and API client
└── requirements.txt       # Python dependencies
```

## Installation & Setup

### Prerequisites
- Python 3.13 or higher
- Node.js 18+ and npm
- OpenWeatherMap API key (optional, for weather data)

### Backend Setup

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd travel-signals-aggregator
   ```

2. **Create a virtual environment**:
   ```bash
   python3 -m venv venv
   ```

3. **Activate the virtual environment**:
   ```bash
   # On macOS/Linux:
   source venv/bin/activate
   
   # On Windows:
   venv\Scripts\activate
   ```

4. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```env
   OPENWEATHER_API_KEY=your_api_key_here
   ```
   
   You can get a free API key from [OpenWeatherMap](https://openweathermap.org/api). The app will still work without it, but weather data won't be available.

### Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd Voyage-Planner
   ```

2. **Install Node dependencies**:
   ```bash
   npm install
   ```

3. **Configure API endpoint** (optional):
   Create a `.env` file in the `Voyage-Planner` directory if you need to change the backend URL:
   ```env
   VITE_API_BASE_URL=http://127.0.0.1:8000
   ```

## Running the Application

### Start the Backend

From the project root directory (with venv activated):

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`

You can also check the interactive API documentation at:
- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

### Start the Frontend

From the `Voyage-Planner` directory:

```bash
npm run dev
```

The frontend will typically run on `http://localhost:5173` (or another port if 5173 is busy).

## API Endpoints

### `GET /health`
Health check endpoint to verify the API is running.

**Response:**
```json
{
  "status": "ok"
}
```

### `GET /travel-signal`
Main endpoint that aggregates all travel signals for a destination.

**Query Parameters:**
- `destination` (required): City name (e.g., "tokyo", "london", "seoul")
- `start_date` (required): Start date in YYYY-MM-DD format
- `end_date` (required): End date in YYYY-MM-DD format

**Example Request:**
```
GET /travel-signal?destination=seoul&start_date=2026-03-10&end_date=2026-03-20
```

**Response:**
```json
{
  "destination": "seoul",
  "start_date": "2026-03-10",
  "end_date": "2026-03-20",
  "total_score": 63,
  "signals": {
    "weather": {
      "score": 50,
      "summary": "Current temperature 1.76°C with overcast clouds",
      "source": "OpenWeatherMap"
    },
    "safety": {
      "score": 74,
      "summary": "Generally safe with standard precautions.",
      "source": "Country Risk Dataset (Fallback)"
    },
    "flights": {
      "score": 70,
      "summary": "Flight prices are moderate",
      "source": "Heuristic Flight Model"
    },
    "holidays": {
      "score": 100,
      "summary": "0 public holidays may increase crowd levels",
      "source": "Nager.Date API"
    },
    "currency": {
      "score": 40,
      "summary": "Destination currency (KRW) is expensive compared to INR",
      "source": "Frankfurter API"
    }
  },
  "missing_signals": []
}
```

## Travel Signals Explained

The system aggregates five different signals to calculate an overall feasibility score:

### 1. Weather Signal
- **API**: OpenWeatherMap (Real API)
- **Status**: ✅ Real data (requires API key)
- **Endpoint**: `https://api.openweathermap.org/data/2.5/weather`
- **What it does**: Fetches current weather conditions for the destination
- **Scoring**: 
  - 85 points: Temperature between 18-28°C (ideal)
  - 70 points: Temperature 10-18°C or 28-35°C (acceptable)
  - 50 points: Outside these ranges (less ideal)
- **Note**: Without an API key, this signal will be missing from results

### 2. Safety Signal
- **API**: Static dataset (Mock/Fallback)
- **Status**: ⚠️ Mock data
- **What it does**: Uses a curated country risk index with safety advisories
- **Scoring**: Converts a 1-5 risk scale to 0-100 safety score
- **Coverage**: Supports major cities in 13+ countries
- **Note**: This is a fallback solution as reliable public safety APIs are limited

### 3. Flights Signal
- **API**: Heuristic model (Mock)
- **Status**: ⚠️ Mock data
- **What it does**: Estimates flight pricing based on destination and season
- **Scoring**: 
  - Base score from city index (55-85)
  - Seasonal adjustment: -10 (peak season), 0 (shoulder), +5 (off-season)
- **Note**: This is a placeholder. For production, integrate with actual flight APIs like Amadeus, Skyscanner, or Google Flights

### 4. Holidays Signal
- **API**: Nager.Date API (Real API)
- **Status**: ✅ Real data (free, no API key required)
- **Endpoint**: `https://date.nager.at/api/v3/PublicHolidays/{year}/{countryCode}`
- **What it does**: Fetches public holidays for the destination country during the travel period
- **Scoring**: 
  - 100 points: No holidays
  - Decreases by 20 points per holiday (max -60)
- **Note**: Helps identify potential crowd levels and price surges

### 5. Currency Signal
- **API**: Frankfurter API (Real API)
- **Status**: ✅ Real data (free, no API key required)
- **Endpoint**: `https://api.frankfurter.app/latest?from=INR&to={currency}`
- **What it does**: Fetches current exchange rates from INR to destination currency
- **Scoring**:
  - 80 points: Rate < 0.5 (affordable)
  - 60 points: Rate 0.5-1.0 (moderate)
  - 40 points: Rate > 1.0 (expensive)
- **Base Currency**: INR (Indian Rupees)

## Score Calculation

The overall feasibility score is calculated using weighted averages:

- **Weather**: 30% weight
- **Safety**: 25% weight
- **Currency**: 20% weight
- **Holidays**: 15% weight
- **Flights**: 10% weight

Missing signals are automatically excluded, and weights are normalized accordingly.

## Supported Destinations

The system currently supports major cities in:
- Japan (Tokyo, Osaka, Kyoto)
- South Korea (Seoul)
- Singapore
- Thailand (Bangkok)
- UAE (Dubai, Abu Dhabi)
- India (Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Pune)
- United States (New York, Los Angeles, San Francisco, Chicago, Miami)
- United Kingdom (London, Manchester, Birmingham)
- France (Paris, Lyon, Nice)
- Germany (Berlin, Munich, Hamburg)
- Italy (Rome, Milan, Venice)
- Australia (Sydney, Melbourne, Brisbane)
- Canada (Toronto, Vancouver, Montreal)
- Spain (Madrid, Barcelona)
- Netherlands (Amsterdam)
- Switzerland (Zurich, Geneva)
- China (Beijing, Shanghai)
- Nepal (Kathmandu)

## Dependencies

### Backend Dependencies
```
fastapi==0.128.0
httpx==0.28.1
pydantic==2.12.5
uvicorn==0.40.0
python-dotenv==1.2.1
requests==2.32.5
```

### Frontend Dependencies (Key)
```
react==19.2.0
typescript==5.6.3
vite==7.1.9
tailwindcss==4.1.14
framer-motion==12.23.24
react-hook-form==7.66.0
zod==3.25.76
@tanstack/react-query==5.60.5
lucide-react==0.545.0
date-fns==3.6.0
```

See `requirements.txt` and `Voyage-Planner/package.json` for complete dependency lists.

## Development Notes

### CORS Configuration
The backend is configured to allow requests from common frontend development ports (5173, 4173, 3000) to enable local development.

### Error Handling
- All API adapters handle errors gracefully
- Missing signals are tracked in the `missing_signals` array
- The system continues to function even if some signals fail

### Async Operations
- Weather, Safety, and Flights signals are fetched concurrently
- Holidays and Currency (sync operations) are run in thread pools
- This ensures fast response times even with multiple API calls

## Future Improvements

- [ ] Integrate real flight pricing APIs (Amadeus, Skyscanner)
- [ ] Add more destinations and city mappings
- [ ] Implement caching for API responses
- [ ] Add historical data analysis
- [ ] Support for multi-city trips
- [ ] User preferences and saved searches
- [ ] Email/SMS notifications for price drops
- [ ] More granular weather forecasts (7-14 day)

## License

MIT License

## Contributing

Feel free to submit issues or pull requests if you'd like to contribute!

---

**Note**: This project was built as a demonstration of aggregating multiple data sources to provide actionable travel insights. Some signals use mock/heuristic data where reliable free APIs are not available.

# travel_agregator
