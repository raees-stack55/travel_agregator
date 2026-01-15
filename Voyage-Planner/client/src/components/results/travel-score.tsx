import { motion } from "framer-motion";
import { Check, AlertTriangle, X } from "lucide-react";

interface TravelScoreProps {
  score: number;
  feasibility: "High" | "Medium" | "Low";
  summary: string;
}

export function TravelScore({ score, feasibility, summary }: TravelScoreProps) {
  const color = score >= 80 ? "text-success" : score >= 60 ? "text-warning" : "text-destructive";
  const bgColor = score >= 80 ? "bg-success" : score >= 60 ? "bg-warning" : "bg-destructive";
  const icon = score >= 80 ? <Check className="w-6 h-6 text-white" /> : score >= 60 ? <AlertTriangle className="w-6 h-6 text-white" /> : <X className="w-6 h-6 text-white" />;

  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white dark:bg-card rounded-3xl p-8 shadow-sm border border-border flex flex-col items-center justify-center text-center relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <div className={`w-32 h-32 rounded-full ${bgColor} blur-2xl`} />
      </div>

      <div className="relative mb-6">
        <svg className="w-40 h-40 transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-muted"
          />
          <motion.circle
            initial={{ strokeDasharray: "440 440", strokeDashoffset: 440 }}
            animate={{ strokeDashoffset: 440 - (440 * score) / 100 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx="80"
            cy="80"
            r="70"
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className={color}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-5xl font-bold ${color}`}>{score}</span>
          <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium mt-1">Score</span>
        </div>
      </div>

      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${bgColor} mb-4`}>
        {icon}
        <span className="text-white font-medium text-sm">{feasibility} Feasibility</span>
      </div>

      <p className="text-muted-foreground leading-relaxed max-w-xs">
        {summary}
      </p>
    </motion.div>
  );
}
