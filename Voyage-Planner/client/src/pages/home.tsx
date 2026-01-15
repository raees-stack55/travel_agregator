import { useState } from "react";
import { differenceInCalendarDays, addDays, format } from "date-fns";
import { Hero } from "@/components/hero";
import { SearchForm } from "@/components/search-form";
import { TravelScore } from "@/components/results/travel-score";
import { WeatherWidget } from "@/components/results/weather-widget";
import { CostCard } from "@/components/results/cost-card";
import { SafetyCard } from "@/components/results/safety-card";
import { DestinationInfo } from "@/components/results/destination-info";
import { SignalCard } from "@/components/results/signal-card";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import {
  fetchTravelSignal,
  TravelSignalResponse,
  BackendSignal,
} from "@/lib/api";
import { Cloud, Shield, Plane, Calendar, DollarSign } from "lucide-react";

type Condition = "Sunny" | "Cloudy" | "Rainy" | "Stormy";

type UiData = {
  destination: string;
  startDate: string;
  endDate: string;
  totalScore: number;
  feasibility: "High" | "Medium" | "Low";
  summary: string;
  dateRange: { from: string; to: string };
  weather: {
    forecast: { date: string; temp: number; condition: Condition }[];
    summary: string;
    score?: number;
  };
  costs: {
    flight: { price: number; trend: "rising" | "falling" | "stable" };
    dailyBudget: number;
    currency: string;
  };
  safety: {
    level: "Low" | "Moderate" | "High";
    advisory: string;
    score?: number;
  };
  signals: {
    weather?: BackendSignal;
    safety?: BackendSignal;
    flights?: BackendSignal;
    holidays?: BackendSignal;
    currency?: BackendSignal;
  };
  missingSignals: string[];
};

function toFeasibility(score: number): "High" | "Medium" | "Low" {
  if (score >= 80) return "High";
  if (score >= 60) return "Medium";
  return "Low";
}

function buildWeatherForecast(
  start: string,
  end: string,
  weatherSignal?: BackendSignal,
): { forecast: UiData["weather"]["forecast"]; summary: string } {
  const totalDays = Math.max(1, differenceInCalendarDays(new Date(end), new Date(start)) + 1);
  const daysToShow = Math.min(totalDays, 10);
  
  // Extract temperature from summary (handles decimals like "1.76°C")
  const tempMatch = weatherSignal?.summary.match(/(-?\d+(?:\.\d+)?)\s*°C/i);
  const baseTemp = tempMatch ? Number(tempMatch[1]) : 24;
  
  // Determine condition from summary text and score
  const summaryLower = (weatherSignal?.summary || "").toLowerCase();
  let condition: Condition = "Cloudy";
  
  if (summaryLower.includes("sunny") || summaryLower.includes("clear")) {
    condition = "Sunny";
  } else if (summaryLower.includes("rain") || summaryLower.includes("drizzle")) {
    condition = "Rainy";
  } else if (summaryLower.includes("storm") || summaryLower.includes("thunder")) {
    condition = "Stormy";
  } else if (summaryLower.includes("cloud")) {
    condition = "Cloudy";
  } else {
    // Fallback to score-based condition
    const score = weatherSignal?.score ?? 60;
    condition = score >= 80 ? "Sunny" : score >= 60 ? "Cloudy" : score >= 40 ? "Rainy" : "Stormy";
  }

  const startDate = new Date(start);
  const forecast = Array.from({ length: daysToShow }).map((_, idx) => ({
    date: format(addDays(startDate, idx), "yyyy-MM-dd"),
    temp: Math.round(baseTemp + (idx % 3 === 0 ? 2 : idx % 3 === 1 ? -1 : 0)),
    condition,
  }));

  return {
    forecast,
    summary: weatherSignal?.summary ?? "Weather data unavailable for this range.",
  };
}

function mapCurrencyCode(summary?: string) {
  const match = summary?.match(/\((\w{3})\)/);
  return match?.[1] ?? "USD";
}

function mapToUiData(api: TravelSignalResponse): UiData {
  const { signals } = api;

  const weatherCard = buildWeatherForecast(
    api.start_date,
    api.end_date,
    signals.weather,
  );

  const totalScore = api.total_score ?? 0;
  const feasibility = toFeasibility(totalScore);
  const missingText =
    api.missing_signals.length > 0
      ? `Missing signals: ${api.missing_signals.join(", ")}. `
      : "";
  const summary =
    missingText +
    (signals.weather?.summary ||
      signals.safety?.summary ||
      "Travel feasibility calculated from available signals.");

  const flightScore = signals.flights?.score ?? 60;
  const price = Math.max(120, Math.round(1800 - flightScore * 12));
  const trend = flightScore >= 80 ? "falling" : flightScore >= 60 ? "stable" : "rising";

  const currencyScore = signals.currency?.score ?? 60;
  const dailyBudget = Math.max(50, Math.round(300 - currencyScore * 1.5));
  const currency = mapCurrencyCode(signals.currency?.summary);

  const safetyScore = signals.safety?.score ?? 50;
  const safetyLevel: UiData["safety"]["level"] =
    safetyScore >= 75 ? "Low" : safetyScore >= 55 ? "Moderate" : "High";

  return {
    destination: api.destination,
    startDate: api.start_date,
    endDate: api.end_date,
    totalScore,
    feasibility,
    summary,
    dateRange: { from: api.start_date, to: api.end_date },
    weather: {
      ...weatherCard,
      score: signals.weather?.score,
    },
    costs: {
      flight: { price, trend },
      dailyBudget,
      currency,
    },
    safety: {
      level: safetyLevel,
      advisory: signals.safety?.summary ?? "Safety data unavailable.",
      score: signals.safety?.score,
    },
    signals: {
      weather: signals.weather,
      safety: signals.safety,
      flights: signals.flights,
      holidays: signals.holidays,
      currency: signals.currency,
    },
    missingSignals: api.missing_signals,
  };
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<UiData | null>(null);
  const { toast } = useToast();

  const handleSearch = async (values: { destination: string; dateRange: { from: Date; to: Date } }) => {
    setLoading(true);
    setData(null);
    try {
      const result = await fetchTravelSignal(values.destination, values.dateRange);
      setData(mapToUiData(result));
    } catch (error: any) {
      toast({
        title: "Error fetching data",
        description: error?.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Hero />
      
      <SearchForm onSearch={handleSearch} isLoading={loading} />

      <div className="container mx-auto px-4 mt-12">
        <AnimatePresence mode="wait">
          {data && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="flex items-baseline gap-4 mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Signal Report: <span className="text-primary">{data.destination}</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Main Score - Takes up large space */}
                <div className="lg:col-span-4">
                  <TravelScore 
                    score={data.totalScore} 
                    feasibility={data.feasibility} 
                    summary={data.summary} 
                  />
                </div>

                {/* Info Grid */}
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Destination Info Card */}
                  <div className="md:col-span-2">
                    <DestinationInfo 
                      destination={data.destination}
                      startDate={data.startDate}
                      endDate={data.endDate}
                    />
                  </div>

                  {/* Weather Widget */}
                  <div className="md:col-span-2">
                    <WeatherWidget weather={data.weather} />
                  </div>

                  {/* Individual Signal Cards */}
                  {data.signals.weather && (
                    <SignalCard
                      title="Weather"
                      icon={Cloud}
                      score={data.signals.weather.score}
                      summary={data.signals.weather.summary}
                      iconColor="text-blue-500"
                      bgColor="bg-blue-50 dark:bg-blue-900/20"
                    />
                  )}

                  {data.signals.safety && (
                    <SignalCard
                      title="Safety"
                      icon={Shield}
                      score={data.signals.safety.score}
                      summary={data.signals.safety.summary}
                      iconColor="text-green-500"
                      bgColor="bg-green-50 dark:bg-green-900/20"
                    />
                  )}

                  {data.signals.flights && (
                    <SignalCard
                      title="Flights"
                      icon={Plane}
                      score={data.signals.flights.score}
                      summary={data.signals.flights.summary}
                      iconColor="text-purple-500"
                      bgColor="bg-purple-50 dark:bg-purple-900/20"
                    />
                  )}

                  {data.signals.holidays && (
                    <SignalCard
                      title="Holidays"
                      icon={Calendar}
                      score={data.signals.holidays.score}
                      summary={data.signals.holidays.summary}
                      iconColor="text-orange-500"
                      bgColor="bg-orange-50 dark:bg-orange-900/20"
                    />
                  )}

                  {data.signals.currency && (
                    <SignalCard
                      title="Currency"
                      icon={DollarSign}
                      score={data.signals.currency.score}
                      summary={data.signals.currency.summary}
                      iconColor="text-amber-500"
                      bgColor="bg-amber-50 dark:bg-amber-900/20"
                    />
                  )}

                  {/* Legacy Cards - Keep for backward compatibility */}
                  <CostCard costs={data.costs} />
                  <SafetyCard safety={data.safety} />
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
        
        {!data && !loading && (
          <div className="mt-20 text-center text-muted-foreground opacity-50">
            <p>Enter a destination and date range to begin analysis.</p>
          </div>
        )}
      </div>
    </div>
  );
}
