import { motion } from "framer-motion";
import { ShieldCheck, Clock, Zap, Gem } from "lucide-react";
import interiorImage from "@/assets/jet-interior.jpg";

const pillars = [
  { icon: ShieldCheck, title: "Absolute Discretion", desc: "Privacy-first operations for high-profile clients. Every detail confidential." },
  { icon: Zap, title: "Complete Flexibility", desc: "Change plans in minutes. We adapt to your schedule, never the reverse." },
  { icon: Clock, title: "Time Efficiency", desc: "Tarmac to takeoff in minutes. Skip the terminals, save hours every trip." },
  { icon: Gem, title: "Luxury Experience", desc: "Impeccable service, bespoke catering, and every detail curated to perfection." },
];

const ExperienceSection = () => (
  <section id="experience" className="section-padding overflow-hidden relative">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(228,22%,4.5%)] to-transparent pointer-events-none" />

    <div className="container mx-auto px-8 relative z-10">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        {/* Left - Image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative order-2 lg:order-1"
        >
          <div className="rounded-2xl overflow-hidden glow-subtle">
            <motion.img
              src={interiorImage}
              alt="Luxury private jet interior"
              className="w-full h-auto object-cover"
              loading="lazy"
              width={1280}
              height={720}
              whileInView={{ scale: 1.03 }}
              initial={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
          <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
        </motion.div>

        {/* Right - Content */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="order-1 lg:order-2"
        >
          <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">The Standard</p>
          <h2 className="text-3xl md:text-5xl font-display font-semibold mb-16 leading-tight text-foreground">
            The Experience
          </h2>

          <div className="space-y-12">
            {pillars.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="flex gap-6 group"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full luxury-border flex items-center justify-center group-hover:glow-subtle transition-all duration-700">
                  <p.icon className="w-4 h-4 text-primary/60" strokeWidth={1.2} />
                </div>
                <div>
                  <h3 className="font-display text-lg mb-2 text-foreground">{p.title}</h3>
                  <p className="text-[12px] text-foreground/40 font-extralight leading-[2]">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default ExperienceSection;
