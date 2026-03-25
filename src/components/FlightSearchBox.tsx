import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Users, ArrowRight } from "lucide-react";

const FlightSearchBox = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-3xl mx-auto mt-8"
    >
      <div className="glass-search rounded-2xl p-2.5">
        <div className="grid grid-cols-2 md:grid-cols-[1fr_1fr_1fr_0.7fr_auto] gap-0">
          {/* From */}
          <div className="md:border-r md:border-r-[hsla(0,0%,100%,0.04)]">
            <div className="px-5 py-3.5">
              <label className="flex items-center gap-1.5 text-[8px] tracking-[0.3em] uppercase text-gold/50 mb-1.5 font-light">
                <MapPin size={9} strokeWidth={1.5} /> From
              </label>
              <input
                type="text"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="City or airport"
                className="w-full bg-transparent text-[13px] text-foreground placeholder:text-foreground/20 font-light focus:outline-none"
              />
            </div>
          </div>

          {/* To */}
          <div className="md:border-r md:border-r-[hsla(0,0%,100%,0.04)]">
            <div className="px-5 py-3.5">
              <label className="flex items-center gap-1.5 text-[8px] tracking-[0.3em] uppercase text-gold/50 mb-1.5 font-light">
                <MapPin size={9} strokeWidth={1.5} /> To
              </label>
              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="City or airport"
                className="w-full bg-transparent text-[13px] text-foreground placeholder:text-foreground/20 font-light focus:outline-none"
              />
            </div>
          </div>

          {/* Date */}
          <div className="md:border-r md:border-r-[hsla(0,0%,100%,0.04)]">
            <div className="px-5 py-3.5">
              <label className="flex items-center gap-1.5 text-[8px] tracking-[0.3em] uppercase text-gold/50 mb-1.5 font-light">
                <Calendar size={9} strokeWidth={1.5} /> Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-transparent text-[13px] text-foreground font-light focus:outline-none [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Passengers */}
          <div>
            <div className="px-5 py-3.5">
              <label className="flex items-center gap-1.5 text-[8px] tracking-[0.3em] uppercase text-gold/50 mb-1.5 font-light">
                <Users size={9} strokeWidth={1.5} /> Guests
              </label>
              <select
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
                className="w-full bg-transparent text-[13px] text-foreground font-light focus:outline-none appearance-none cursor-pointer"
              >
                <option value="" className="bg-charcoal text-foreground">Select</option>
                {[...Array(16)].map((_, i) => (
                  <option key={i + 1} value={i + 1} className="bg-charcoal text-foreground">
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Button */}
          <div className="col-span-2 md:col-span-1 flex items-center px-2 py-2">
            <button className="w-full md:w-12 h-12 bg-gradient-gold rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_25px_-5px_hsla(38,52%,50%,0.5)] transition-all duration-500 hover:scale-105">
              <ArrowRight size={16} className="text-primary-foreground" strokeWidth={2} />
              <span className="md:hidden text-primary-foreground text-[10px] tracking-[0.2em] uppercase font-medium">Search Flights</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FlightSearchBox;
