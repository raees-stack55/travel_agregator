import { motion } from "framer-motion";
import heroImage from "@assets/generated_images/cinematic_travel_landscape_collage.png";

export function Hero() {
  return (
    <div className="relative w-full h-[60vh] min-h-[500px] overflow-hidden rounded-b-[3rem] shadow-2xl">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent z-10" />
      
      {/* Content */}
      <div className="relative z-20 container mx-auto h-full flex flex-col items-center justify-center text-center px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium mb-6">
            Smart Travel Aggregator
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg tracking-tight">
            Travel smarter,<br />not harder.
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md">
            Get instant feasibility checks, risk analysis, and cost estimates for your next journey.
            One search, complete clarity.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
