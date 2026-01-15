import { motion } from "framer-motion";
import { Cloud, Sun, CloudRain, CloudLightning } from "lucide-react";
import { format } from "date-fns";

interface WeatherProps {
  weather: {
    forecast: { date: string; temp: number; condition: "Sunny" | "Cloudy" | "Rainy" | "Stormy" }[];
    summary: string;
  };
}

const icons = {
  Sunny: Sun,
  Cloudy: Cloud,
  Rainy: CloudRain,
  Stormy: CloudLightning
};

export function WeatherWidget({ weather }: WeatherProps) {
  return (
    <div className="bg-white dark:bg-card rounded-3xl p-6 shadow-sm border border-border h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-2">Weather Forecast</h3>
      <p className="text-sm text-muted-foreground mb-6">{weather.summary}</p>
      
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {weather.forecast.map((day, idx) => {
          const Icon = icons[day.condition];
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex-shrink-0 flex flex-col items-center min-w-[80px] p-4 rounded-2xl bg-muted/30 border border-muted"
            >
              <span className="text-xs font-medium text-muted-foreground mb-2">
                {format(new Date(day.date), "EEE")}
              </span>
              <Icon className={`w-8 h-8 mb-2 ${day.condition === 'Sunny' ? 'text-orange-400' : 'text-blue-400'}`} />
              <span className="text-lg font-bold">{day.temp}°</span>
              <span className="text-[10px] text-muted-foreground uppercase">{day.condition}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
