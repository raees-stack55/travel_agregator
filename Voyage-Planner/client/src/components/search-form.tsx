import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarIcon, MapPin, Search, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const formSchema = z.object({
  destination: z.string().min(2, "Destination is required"),
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }).required(),
});

interface SearchFormProps {
  onSearch: (data: z.infer<typeof formSchema>) => void;
  isLoading: boolean;
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSearch(values);
  }

  return (
    <div className="w-full max-w-4xl mx-auto -mt-16 relative z-30 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="bg-white/80 dark:bg-card/80 backdrop-blur-xl border border-white/20 dark:border-border p-6 rounded-2xl shadow-xl"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-4 items-end">
            
            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-muted-foreground font-medium ml-1">Where to?</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-primary/60" />
                      <Input 
                        placeholder="e.g. Tokyo, Paris, Bali" 
                        {...field} 
                        className="pl-10 h-12 bg-white/50 dark:bg-black/20 border-border/50 focus:border-primary/50 text-lg transition-all hover:bg-white/80"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateRange"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-muted-foreground font-medium ml-1">When?</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full h-12 pl-3 text-left font-normal bg-white/50 dark:bg-black/20 border-border/50 hover:bg-white/80 text-lg",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="ml-auto h-5 w-5 opacity-50 mr-2" />
                          {field.value?.from ? (
                            field.value.to ? (
                              <>
                                {format(field.value.from, "MMM dd")} -{" "}
                                {format(field.value.to, "MMM dd, yyyy")}
                              </>
                            ) : (
                              format(field.value.from, "MMM dd, yyyy")
                            )
                          ) : (
                            <span>Pick a date range</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start" sideOffset={8}>
                      <div className="flex flex-col">
                        <Calendar
                          mode="range"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                        {field.value?.from && (
                          <div className="border-t border-border p-3 flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                field.onChange(undefined);
                              }}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-semibold shadow-md transition-all hover:scale-105 active:scale-95"
                            >
                              <X className="h-4 w-4" />
                              Clear Selection
                            </button>
                          </div>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              size="lg" 
              className="h-12 px-8 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-transform active:scale-95"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Analyzing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search
                </span>
              )}
            </Button>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}
