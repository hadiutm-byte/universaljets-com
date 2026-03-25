import { motion } from "framer-motion";
import { Bookmark, Settings, Plane, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const features = [
  {
    icon: Bookmark,
    title: "Saved Trips",
    desc: "Access your saved itineraries, past bookings, and favourite routes in one place.",
  },
  {
    icon: Settings,
    title: "Preferences",
    desc: "Set your preferred aircraft, catering choices, ground transport, and cabin configurations.",
  },
  {
    icon: Plane,
    title: "Quick Booking",
    desc: "Re-book frequent routes with a single tap. Your preferences are pre-loaded automatically.",
  },
];

const MembersPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    {/* Hero */}
    <section className="pt-40 pb-20 md:pt-48 md:pb-28">
      <div className="container mx-auto px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1 }}
          className="w-12 h-[1px] bg-gradient-to-r from-transparent via-gold/80 to-transparent mx-auto mb-10 origin-center"
        />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-[9px] tracking-[0.5em] uppercase text-gold/70 mb-6 font-light"
        >
          Exclusive Access
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold mb-6"
        >
          Members Area
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-[13px] text-foreground/40 font-extralight max-w-md mx-auto leading-[2]"
        >
          Your personal aviation dashboard. Manage bookings, set preferences, and book your next flight in seconds.
        </motion.p>
      </div>
    </section>

    {/* Login Card */}
    <section className="pb-20">
      <div className="container mx-auto px-8 max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="glass rounded-2xl p-8"
        >
          <h2 className="font-display text-lg mb-6 text-center">Sign In</h2>
          <div className="space-y-4">
            <div>
              <label className="text-[9px] tracking-[0.25em] uppercase text-gold/50 mb-2 block font-light">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full bg-secondary/50 rounded-lg px-4 py-3 text-[13px] text-foreground placeholder:text-foreground/20 font-light focus:outline-none focus:ring-1 focus:ring-gold/20 transition-all luxury-border"
              />
            </div>
            <div>
              <label className="text-[9px] tracking-[0.25em] uppercase text-gold/50 mb-2 block font-light">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-secondary/50 rounded-lg px-4 py-3 text-[13px] text-foreground placeholder:text-foreground/20 font-light focus:outline-none focus:ring-1 focus:ring-gold/20 transition-all luxury-border"
              />
            </div>
            <button className="w-full py-3.5 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.25em] uppercase font-medium rounded-lg hover:shadow-[0_0_30px_-8px_hsla(38,52%,50%,0.45)] transition-all duration-500 mt-2">
              Sign In
            </button>
            <p className="text-center text-[10px] text-foreground/30 font-extralight mt-4">
              Don't have an account?{" "}
              <span className="text-gold/60 cursor-pointer hover:text-gold transition-colors">Request Access</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Features Preview */}
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-8">
        <div className="divider-gold mb-20" />
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-[9px] tracking-[0.5em] uppercase text-gold/60 mb-16 font-light"
        >
          What's Inside
        </motion.p>

        <div className="grid md:grid-cols-3 gap-10 max-w-4xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="text-center group"
            >
              <div className="w-14 h-14 rounded-full luxury-border flex items-center justify-center mx-auto mb-7 group-hover:glow-subtle transition-all duration-700">
                <f.icon className="w-5 h-5 text-gold/60" strokeWidth={1.2} />
              </div>
              <h3 className="font-display text-lg mb-3">{f.title}</h3>
              <p className="text-[12px] text-muted-foreground font-extralight leading-[2]">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[9px] tracking-[0.2em] uppercase text-gold/50 hover:text-gold transition-all duration-500"
          >
            Back to Home <ArrowRight size={10} />
          </Link>
        </motion.div>
      </div>
    </section>

    <Footer />
  </div>
);

export default MembersPage;
