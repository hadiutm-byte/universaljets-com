import { motion } from "framer-motion";
import { Plane } from "lucide-react";
import { Link } from "react-router-dom";

const charterCategories = [
  {
    title: "Leisure Charter",
    desc: "Your island doesn't have a runway? We'll find one nearby. Ski trips, honeymoons, family escapes — 10,000+ destinations with zero layovers and zero strangers on board.",
    slug: "leisure",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441238946/F94ypwks3ADk2wFrxZVnWB/leisure-travel-luxury-azcFavRQuX4DrgSwWAoAtx.webp",
  },
  {
    title: "Corporate Solutions",
    desc: "Three cities in one day. Boardroom at 40,000 feet. Your NDA starts at the cabin door. Multi-city roadshows, investor meetings, and retreats built around your schedule — not an airline's.",
    slug: "corporate",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441238946/F94ypwks3ADk2wFrxZVnWB/corporate-executive-jet-a3dWZJiLaShszow9sv8fuB.webp",
  },
  {
    title: "Medical Evacuations",
    desc: "When minutes decide outcomes, we don't wait for morning. ICU-equipped jets, trained medical crews, and clearance through conflict zones — we've brought people home from places others won't fly into.",
    slug: "medevac",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441238946/F94ypwks3ADk2wFrxZVnWB/medical-jet-evacuation_c1c73ba0.png",
  },
  {
    title: "Cargo & Special Missions",
    desc: "Hazmat-certified. Government-cleared. From humanitarian aid drops to classified freight, we move what others can't — or won't. Permits, customs, and compliance handled before you finish your coffee.",
    slug: "cargo",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441238946/F94ypwks3ADk2wFrxZVnWB/cargo-charter-loading-UNLEgPt7hoTHe7qWvdfsRq.webp",
  },
  {
    title: "VIP Helicopter Transfers",
    desc: "Dubai traffic is someone else's problem. Airport to hotel in minutes, not hours. Premium rotorcraft for executives who treat time like the currency it is.",
    slug: "helicopter",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441238946/F94ypwks3ADk2wFrxZVnWB/vip-helicopter-transfer-kAGxmTqso7jNsiQQtZLzEv.webp",
  },
  {
    title: "Group Charter",
    desc: "Corporate delegations, sports teams, concert tours, religious pilgrimages. We've moved 50,000+ passengers across six continents — including FIFA World Cup 2022.",
    slug: "group",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441238946/F94ypwks3ADk2wFrxZVnWB/group-charter-boarding_c6a14ad9.jpg",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.12,
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

const CharterSolutionsSection = () => (
  <section className="py-24 md:py-32">
    <div className="max-w-7xl mx-auto px-6 md:px-10">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center text-[11px] tracking-[0.3em] uppercase font-medium text-primary mb-4"
      >
        What We Do
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.05 }}
        className="text-center font-display text-4xl md:text-5xl font-semibold text-foreground mb-4"
      >
        Seven Reasons They Call Us <em className="text-primary font-display">First</em>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-center text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mb-16"
      >
        Every mission is different. The broker shouldn't be.
      </motion.p>

      {/* Cards grid — staggered reveal with hover lift + image zoom + gold border */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {charterCategories.map((cat, i) => (
          <motion.div
            key={cat.slug}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={cardVariants}
            whileHover={{ y: -8, transition: { duration: 0.35 } }}
            className="group relative rounded-2xl border border-border bg-card overflow-hidden card-cinematic cursor-pointer"
          >
            {/* Image with hover zoom */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            <div className="p-6">
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
          for leisure, corporate, urgent, and specialist missions. 50,000+ aircraft. Every single operator
          vetted through ARGUS and Wyvern before we put their name in front of you.
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
