import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

interface CostCardProps {
  costs: {
    flight: { price: number; trend: "rising" | "falling" | "stable" };
    dailyBudget: number;
    currency: string;
  };
}

export function CostCard({ costs }: CostCardProps) {
  return (
    <div className="bg-white dark:bg-card rounded-3xl p-6 shadow-sm border border-border h-full flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold mb-4">Estimated Costs</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Est. Flight Cost</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">
                    {costs.currency} {costs.flight.price}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${costs.flight.trend === 'rising' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {costs.flight.trend}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-border" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-500">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Daily Budget</p>
                <span className="text-2xl font-bold">
                  {costs.currency} {costs.dailyBudget}
                </span>
                <span className="text-xs text-muted-foreground ml-1">/ day</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-muted/30 p-3 rounded-lg text-xs text-muted-foreground text-center">
        *Based on average traveler spending and current flight data.
      </div>
    </div>
  );
}
