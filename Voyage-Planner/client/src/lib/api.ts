const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

export interface BackendSignal {
  score: number;
  summary: string;
  source: string;
}

export interface TravelSignalResponse {
  destination: string;
  start_date: string;
  end_date: string;
  total_score: number;
  signals: Record<string, BackendSignal | undefined>;
  missing_signals: string[];
}

type DateRange = { from: Date; to: Date };

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function fetchTravelSignal(
  destination: string,
  dates: DateRange,
): Promise<TravelSignalResponse> {
  const params = new URLSearchParams({
    destination,
    start_date: formatDate(dates.from),
    end_date: formatDate(dates.to),
  });

  const res = await fetch(`${API_BASE_URL}/travel-signal?${params.toString()}`);

  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `API error ${res.status}: ${body || res.statusText || "Unknown error"}`,
    );
  }

  return (await res.json()) as TravelSignalResponse;
}

