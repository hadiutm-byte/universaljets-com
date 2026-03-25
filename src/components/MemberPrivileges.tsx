import { motion } from "framer-motion";
import { Hotel, Car, Sparkles } from "lucide-react";

const privileges = [
  { icon: Hotel, text: "Complimentary suite upgrades at partner hotels" },
  { icon: Car, text: "Discounts on luxury chauffeur services" },
  { icon: Sparkles, text: "Exclusive access to VIP events" },
];

const MemberPrivileges = () => (
  <section className="py-20 relative">
    <div className="container mx-auto px-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-14"
      >
        <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">
          Beyond Aviation
        </p>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-semibold text-foreground mb-4">
          Member <span className="text-gradient-gold italic">Privileges</span>
        </h2>
        <p className="text-[12px] text-foreground/35 font-extralight leading-[2] max-w-lg mx-auto">
          Your membership comes with more than flights — enjoy curated luxury experiences worldwide.
        </p>
      </motion.div>

      <div className="max-w-md mx-auto space-y-4 mb-12">
        {privileges.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="flex items-center gap-4 py-4 px-5 rounded-xl border border-border/8 bg-card/8"
          >
            <p.icon className="w-4 h-4 text-primary/50 flex-shrink-0" strokeWidth={1.2} />
            <span className="text-[12px] text-foreground/50 font-extralight">{p.text}</span>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="text-center text-[11px] text-foreground/25 font-extralight italic"
      >
        Wherever you go, your membership travels with you.
      </motion.p>
    </div>
  </section>
);

export default MemberPrivileges;
