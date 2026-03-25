import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Users, Search } from "lucide-react";

const FlightSearchBox = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [depDate, setDepDate] = useState("");
  const [retDate, setRetDate] = useState("");
  const [passengers, setPassengers] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-4xl mx-auto mt-12"
    >
      <div className="glass-search rounded-2xl p-3">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
          {/* From */}
          <div className="relative group md:border-r md:border-r-[hsla(0,0%,100%,0.05)]">
            <div className="px-5 py-4">
              <label className="flex items-center gap-2 text-[9px] tracking-[0.25em] uppercase text-gold/70 mb-2 font-light">
                <MapPin size={10} strokeWidth={1.5} /> From
              </label>
              <input
                type="text"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="City or airport"
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 font-light focus:outline-none"
              />
            </div>
          </div>

          {/* To */}
          <div className="relative group md:border-r md:border-r-[hsla(0,0%,100%,0.05)]">
            <div className="px-5 py-4">
              <label className="flex items-center gap-2 text-[9px] tracking-[0.25em] uppercase text-gold/70 mb-2 font-light">
                <MapPin size={10} strokeWidth={1.5} /> To
              </label>
              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="City or airport"
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 font-light focus:outline-none"
              />
            </div>
          </div>

          {/* Departure */}
          <div className="relative group md:border-r md:border-r-[hsla(0,0%,100%,0.05)]">
            <div className="px-5 py-4">
              <label className="flex items-center gap-2 text-[9px] tracking-[0.25em] uppercase text-gold/70 mb-2 font-light">
                <Calendar size={10} strokeWidth={1.5} /> Departure
              </label>
              <input
                type="date"
                value={depDate}
                onChange={(e) => setDepDate(e.target.value)}
                className="w-full bg-transparent text-sm text-foreground font-light focus:outline-none [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Return */}
          <div className="relative group md:border-r md:border-r-[hsla(0,0%,100%,0.05)]">
            <div className="px-5 py-4">
              <label className="flex items-center gap-2 text-[9px] tracking-[0.25em] uppercase text-gold/70 mb-2 font-light">
                <Calendar size={10} strokeWidth={1.5} /> Return
              </label>
              <input
                type="date"
                value={retDate}
                onChange={(e) => setRetDate(e.target.value)}
                className="w-full bg-transparent text-sm text-foreground font-light focus:outline-none [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Passengers + Button */}
          <div className="flex items-end gap-2 px-5 py-4 md:px-3">
            <div className="flex-1">
              <label className="flex items-center gap-2 text-[9px] tracking-[0.25em] uppercase text-gold/70 mb-2 font-light">
                <Users size={10} strokeWidth={1.5} /> Guests
              </label>
              <select
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
                className="w-full bg-transparent text-sm text-foreground font-light focus:outline-none appearance-none cursor-pointer"
              >
                <option value="" className="bg-charcoal">Select</option>
                {[...Array(16)].map((_, i) => (
                  <option key={i + 1} value={i + 1} className="bg-charcoal">
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
            <button className="flex-shrink-0 w-11 h-11 bg-gradient-gold rounded-lg flex items-center justify-center hover:shadow-[0_0_25px_-5px_hsla(38,52%,50%,0.5)] transition-all duration-500 hover:scale-105">
              <Search size={16} className="text-primary-foreground" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FlightSearchBox;
