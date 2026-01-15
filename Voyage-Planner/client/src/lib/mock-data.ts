import { addDays, format } from "date-fns";

export interface TravelSignal {
  destination: string;
  overallScore: number; // 0-100
  feasibility: "High" | "Medium" | "Low";
  summary: string;
  weather: {
    forecast: { date: string; temp: number; condition: "Sunny" | "Cloudy" | "Rainy" | "Stormy" }[];
    summary: string;
  };
  costs: {
    flight: { price: number; trend: "rising" | "falling" | "stable" };
    dailyBudget: number;
    currency: string;
    rate: number;
  };
  safety: {
    level: "Low" | "Moderate" | "High";
    advisory: string;
  };
  holidays: { name: string; date: string }[];
}

export const MOCK_DESTINATIONS = [
  "Tokyo, Japan",
  "Paris, France",
  "New York, USA",
  "Bali, Indonesia",
  "London, UK",
  "Reykjavik, Iceland"
];

const WEATHER_CONDITIONS = ["Sunny", "Cloudy", "Rainy", "Stormy"] as const;

export async function fetchTravelSignal(destination: string, dates: { from: Date; to: Date }): Promise<TravelSignal> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Deterministic-ish randomness based on destination length
  const seed = destination.length;
  const isGoodDest = seed % 2 === 0;

  const score = isGoodDest ? 85 + (Math.random() * 10) : 60 + (Math.random() * 20);
  
  const days = [];
  let curr = dates.from;
  while (curr <= dates.to) {
    days.push(curr);
    curr = addDays(curr, 1);
  }

  const forecast = days.map(d => ({
    date: format(d, 'yyyy-MM-dd'),
    temp: 20 + Math.floor(Math.random() * 10),
    condition: WEATHER_CONDITIONS[Math.floor(Math.random() * (isGoodDest ? 2 : 4))]
  }));

  return {
    destination,
    overallScore: Math.floor(score),
    feasibility: score > 80 ? "High" : score > 60 ? "Medium" : "Low",
    summary: score > 80 
      ? "Excellent time to visit! Weather is favorable and costs are stable." 
      : "Travel is feasible but be aware of potential weather disruptions.",
    weather: {
      forecast,
      summary: isGoodDest ? "Expect mostly sunny days with mild temperatures." : "Mixed conditions expected, pack for rain."
    },
    costs: {
      flight: { 
        price: 500 + (seed * 50), 
        trend: isGoodDest ? "stable" : "rising" 
      },
      dailyBudget: 150 + (seed * 10),
      currency: "USD",
      rate: 1.0
    },
    safety: {
      level: isGoodDest ? "Low" : "Moderate",
      advisory: isGoodDest ? "Standard travel precautions apply." : "Exercise increased caution due to local events."
    },
    holidays: isGoodDest ? [] : [{ name: "Local Festival", date: format(days[0], 'yyyy-MM-dd') }]
  };
}
