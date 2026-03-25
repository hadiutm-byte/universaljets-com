import { motion } from "framer-motion";
import { Plane, Building2, Users, HeartPulse, Package, Navigation } from "lucide-react";
import { Link } from "react-router-dom";

const charterCategories = [
  {
    icon: Plane,
    title: "Leisure Charter",
    desc: "Holiday escapes, family trips, and island-hopping — tailored to your schedule.",
    slug: "leisure",
  },
  {
    icon: Building2,
    title: "Corporate Charter",
    desc: "Board meetings, roadshows, and multi-city itineraries with total discretion.",
    slug: "corporate",
  },
  {
    icon: Users,
    title: "Group Charter",
    desc: "Sports teams, incentive travel, and large-party logistics made seamless.",
    slug: "group",
  },
  {
    icon: HeartPulse,
    title: "Medical Evacuation",
    desc: "Air ambulance coordination with medical crew, equipment, and bed-to-bed transfers.",
    slug: "medevac",
  },
  {
    icon: Package,
    title: "Cargo & Special Missions",
    desc: "Oversized freight, sensitive shipments, and government or NGO operations.",
    slug: "cargo",
  },
  {
    icon: Navigation,
    title: "Helicopter Transfers",
    desc: "City-to-airport, yacht-to-shore, and short-range VIP helicopter movements.",
    slug: "helicopter",
  },
];

const CharterSolutionsSection = () => (
  <section className="py-24 md:py-32">
    <div className="max-w-7xl mx-auto px-6 md:px-10">
      {/* Label */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center text-[11px] tracking-[0.3em] uppercase font-medium text-primary mb-4"
      >
        Charter Solutions
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.05 }}
        className="text-center font-display text-4xl md:text-5xl font-semibold text-foreground mb-4"
      >
        Every Mission. <em className="text-primary font-display">One Partner.</em>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-center text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mb-16"
      >
        From leisure getaways to life-saving evacuations — we source the right aircraft for every scenario.
      </motion.p>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {charterCategories.map((cat, i) => (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: 0.5 }}
            className="group relative rounded-2xl border border-border bg-card p-8 hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)] transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors">
              <cat.icon size={26} className="text-primary" strokeWidth={1.4} />
            </div>

            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              {cat.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              {cat.desc}
            </p>

            <div className="flex items-center gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-[11px] tracking-[0.1em] uppercase font-medium hover:bg-primary/90 transition-colors"
              >
                Request a Flight
              </Link>
              <Link
                to={`/charter/${cat.slug}`}
                className="inline-flex items-center gap-1 text-[11px] tracking-[0.1em] uppercase font-medium text-foreground/60 hover:text-primary transition-colors"
              >
                Explore →
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Core message block */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15 }}
        className="mt-20 md:mt-28 max-w-3xl mx-auto text-center"
      >
        <p className="text-[11px] tracking-[0.3em] uppercase font-medium text-primary mb-4">
          Our Core
        </p>
        <h3 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-6">
          Private Jet Charter Is What We Do
        </h3>
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8">
          Universal Jets is a broker-led private jet charter company providing global aircraft access
          for leisure, corporate, urgent, and specialist missions. We analyse the entire market —
          not just one fleet — to deliver the right aircraft, route, and price for every client.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground text-[12px] tracking-[0.15em] uppercase font-semibold hover:bg-primary/90 transition-colors shadow-[0_8px_24px_hsl(var(--primary)/0.25)]"
        >
          <Plane size={16} strokeWidth={1.5} />
          Request a Flight
        </Link>
      </motion.div>
    </div>
  </section>
);

export default CharterSolutionsSection;
