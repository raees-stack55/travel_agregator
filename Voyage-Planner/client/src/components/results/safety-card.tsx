import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";

interface SafetyCardProps {
  safety: {
    level: "Low" | "Moderate" | "High";
    advisory: string;
  };
}

export function SafetyCard({ safety }: SafetyCardProps) {
  const isSafe = safety.level === "Low";
  const color = isSafe ? "text-success" : safety.level === "Moderate" ? "text-warning" : "text-destructive";
  const bg = isSafe ? "bg-success/10" : safety.level === "Moderate" ? "bg-warning/10" : "bg-destructive/10";
  const Icon = isSafe ? ShieldCheck : safety.level === "Moderate" ? Shield : ShieldAlert;

  return (
    <div className={`rounded-3xl p-6 border ${isSafe ? 'border-success/20' : 'border-border'} ${bg} h-full`}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl bg-white dark:bg-card ${color} shadow-sm`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className={`text-lg font-bold ${color} mb-1`}>{safety.level} Risk</h3>
          <p className="text-sm opacity-80 leading-relaxed font-medium">
            {safety.advisory}
          </p>
        </div>
      </div>
    </div>
  );
}
