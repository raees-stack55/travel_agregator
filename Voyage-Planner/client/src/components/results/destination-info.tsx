import { MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface DestinationInfoProps {
  destination: string;
  startDate: string;
  endDate: string;
}

export function DestinationInfo({ destination, startDate, endDate }: DestinationInfoProps) {
  return (
    <div className="bg-white dark:bg-card rounded-3xl p-8 shadow-sm border border-border">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Destination */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-7 h-7 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">Destination</p>
            <Badge variant="secondary" className="text-lg font-bold px-4 py-2">
              {destination}
            </Badge>
          </div>
        </div>

        {/* Start Date */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-7 h-7 text-blue-500" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">Start Date</p>
            <Badge variant="outline" className="text-lg font-semibold px-4 py-2">
              {format(new Date(startDate), "MMM dd, yyyy")}
            </Badge>
          </div>
        </div>

        {/* End Date */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-7 h-7 text-green-500" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">End Date</p>
            <Badge variant="outline" className="text-lg font-semibold px-4 py-2">
              {format(new Date(endDate), "MMM dd, yyyy")}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

