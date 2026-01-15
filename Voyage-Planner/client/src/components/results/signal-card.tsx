import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface SignalCardProps {
  title: string;
  icon: LucideIcon;
  score: number;
  summary: string;
  iconColor?: string;
  bgColor?: string;
}

export function SignalCard({ 
  title, 
  icon: Icon, 
  score, 
  summary,
  iconColor = "text-primary",
  bgColor = "bg-primary/10"
}: SignalCardProps) {
  const scoreColor = score >= 80 ? "text-green-600" : score >= 60 ? "text-yellow-600" : "text-red-600";
  const scoreBg = score >= 80 ? "bg-green-50 dark:bg-green-900/20" : score >= 60 ? "bg-yellow-50 dark:bg-yellow-900/20" : "bg-red-50 dark:bg-red-900/20";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-card rounded-3xl p-6 shadow-sm border border-border h-full flex flex-col"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className={`px-3 py-1.5 rounded-full ${scoreBg} ${scoreColor} font-semibold text-xs`}>
          score : {score}
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground leading-relaxed flex-1">
        {summary}
      </p>
    </motion.div>
  );
}

