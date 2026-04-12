import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plane, CheckCircle, MapPin, Star, Shield, HeadphonesIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const destinations = [
  {
    city: "Dubai",
    country: "UAE",
    headline: "The Ultimate Private Jet Hub",
    description:
      "Step into the bustling city of Dubai, where luxury and business go hand-in-hand. Our jet charters to Dubai ensure you arrive in style, ready to enjoy its world-class amenities, financial districts, and renowned landmarks.",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663441238946/F94ypwks3ADk2wFrxZVnWB/corporate-executive-jet-a3dWZJiLaShszow9sv8fuB.webp",
  },
  {
    city: "Riyadh",
    country: "Saudi Arabia",
    headline: "Seamless Business Jet Travel",
    description:
      "Riyadh, the capital of Saudi Arabia, is a prime destination for business travelers. With Universal Jets, you can rely on punctual, private flights that align with your corporate needs.",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663441238946/F94ypwks3ADk2wFrxZVnWB/leisure-travel-luxury-azcFavRQuX4DrgSwWAoAtx.webp",
  },
  {
    city: "Doha",
    country: "Qatar",
    headline: "Luxury Jets for Every Occasion",
    description:
      "From corporate meetings to leisure retreats, Doha offers a balance of luxury and business opportunities. Book your private flight to Qatar's capital with Universal Jets for a stress-free experience.",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663441238946/F94ypwks3ADk2wFrxZVnWB/group-charter-boarding_c6a14ad9.jpg",
  },
];

const reasons = [
  {
    icon: Star,
    title: "Unmatched Luxury",
    description:
      "Fly in state-of-the-art private jets equipped with the finest amenities.",
  },
  {
    icon: Plane,
    title: "Flexible Travel",
    description:
      "Choose the schedule and destinations that suit your lifestyle.",
  },
  {
    icon: Shield,
    title: "Unbeatable Safety",
    description:
      "Our fleet adheres to the highest safety standards, ensuring peace of mind on every journey.",
  },
  {
    icon: HeadphonesIcon,
    title: "Premium Support",
    description:
      "From booking to landing, our team ensures a smooth travel experience.",
  },
];

const fleet = [
  {
    name: "Light Jets",
    example: "Phenom 300 / Citation CJ3",
    detail: "Perfect for short GCC hops — Dubai to Abu Dhabi or Riyadh to Jeddah.",
  },
  {
    name: "Midsize Jets",
    example: "Challenger 350 / Citation Latitude",
    detail: "Ideal for regional GCC routes with added cabin comfort.",
  },
  {
    name: "Large Cabin Jets",
    example: "Gulfstream G650 / Challenger 650",
    detail: "Spacious interiors for executive teams and VIP groups.",
  },
  {
    name: "Ultra-Long-Range",
    example: "Global 7500 / Gulfstream G700",
    detail: "Non-stop connectivity from the GCC to Europe, Asia, and beyond.",
  },
];

const GccPage = () => (
  <div className="min-h-screen bg-background">
    <SEOHead
      title="Luxury Private Jet Charters in the GCC - Universal Jets"
      description="Fly privately with Universal Jets across the GCC. Book luxury jet charters in Dubai, Riyadh, Doha, and beyond. Experience seamless air travel today!"
      path="/gcc"
      breadcrumbs={[
        { name: "Home", path: "/" },
        { name: "GCC Private Jet Charters", path: "/gcc" },
      ]}
    />
    <Navbar />

    {/* ═══ HERO ═══ */}
    <section className="relative pt-36 pb-20 md:pt-48 md:pb-28 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663441238946/F94ypwks3ADk2wFrxZVnWB/corporate-executive-jet-a3dWZJiLaShszow9sv8fuB.webp"
          alt="Luxury private jet flying over the Gulf"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>
      <div className="relative container mx-auto px-6 md:px-10 max-w-4xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[11px] tracking-[0.5em] uppercase text-primary mb-4 font-medium"
        >
          Gulf Cooperation Council
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold text-foreground mb-6 leading-tight"
        >
          Luxury Private Jet Charters in the GCC
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="text-base md:text-lg text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto mb-10"
        >
          Experience the pinnacle of luxury and convenience with Universal Jets. Our private jet
          charter services are designed for travelers in the GCC who prioritize comfort, efficiency,
          and personalized travel. Whether you're flying for business or leisure, we provide seamless
          private flights tailored to your needs.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/request-flight"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground text-[12px] tracking-[0.15em] uppercase font-semibold hover:bg-primary/90 transition-colors shadow-[0_8px_24px_hsl(var(--primary)/0.25)]"
          >
            <Plane size={16} strokeWidth={1.5} />
            Request a GCC Charter
          </Link>
          <a
            href="https://wa.me/447888999944"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-border text-foreground/70 text-[12px] tracking-[0.15em] uppercase font-medium hover:text-foreground hover:border-primary/40 transition-colors"
          >
            Speak to an Advisor
          </a>
        </motion.div>
      </div>
    </section>

    {/* ═══ WHY CHOOSE UNIVERSAL JETS ═══ */}
    <section className="py-20 md:py-28 bg-card/50">
      <div className="container mx-auto px-6 md:px-10 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <p className="text-[11px] tracking-[0.4em] uppercase text-primary mb-3 font-medium">
            Why Us
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
            Why Choose Universal Jets?
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="rounded-2xl border border-border bg-card p-7 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all"
            >
              <Icon size={22} className="text-primary mb-4" strokeWidth={1.5} />
              <h3 className="font-display text-base font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ═══ EXCLUSIVE DESTINATIONS ═══ */}
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-6 md:px-10 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <p className="text-[11px] tracking-[0.4em] uppercase text-primary mb-3 font-medium">
            Destinations
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Exclusive Destinations in the GCC
          </h2>
          <p className="text-muted-foreground text-[15px] max-w-xl mx-auto leading-relaxed">
            At Universal Jets, we connect you to the most coveted destinations in the Gulf
            Cooperation Council.
          </p>
        </motion.div>

        <div className="flex flex-col gap-10">
          {destinations.map(({ city, country, headline, description, image }, i) => (
            <motion.div
              key={city}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className={`flex flex-col md:flex-row ${i % 2 !== 0 ? "md:flex-row-reverse" : ""} gap-8 items-center rounded-2xl border border-border bg-card overflow-hidden`}
            >
              <div className="md:w-2/5 h-56 md:h-auto min-h-[220px] w-full shrink-0">
                <img
                  src={image}
                  alt={`Private jet charter to ${city}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 md:p-10 flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={14} className="text-primary" strokeWidth={1.5} />
                  <span className="text-[11px] tracking-[0.3em] uppercase text-primary font-medium">
                    {city}, {country}
                  </span>
                </div>
                <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-3">
                  {city} – {headline}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {description}
                </p>
                <Link
                  to="/request-flight"
                  className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-primary hover:underline font-medium"
                >
                  <Plane size={12} strokeWidth={1.5} />
                  Book a flight to {city}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ═══ OUR EXCEPTIONAL FLEET ═══ */}
    <section className="py-20 md:py-28 bg-card/50">
      <div className="container mx-auto px-6 md:px-10 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <p className="text-[11px] tracking-[0.4em] uppercase text-primary mb-3 font-medium">
            Aircraft
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Our Exceptional Jet Fleet
          </h2>
          <p className="text-muted-foreground text-[15px] max-w-xl mx-auto leading-relaxed">
            From nimble light jets for short GCC hops to ultra-long-range cabins for intercontinental
            journeys, we match every mission with the perfect aircraft.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {fleet.map(({ name, example, detail }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="rounded-2xl border border-border bg-card p-7 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all"
            >
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={16} className="text-primary shrink-0" strokeWidth={1.5} />
                <h3 className="font-display text-sm font-semibold text-foreground">{name}</h3>
              </div>
              <p className="text-[11px] tracking-[0.15em] uppercase text-primary/70 mb-2">{example}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{detail}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/fleet"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-border text-foreground/70 text-[12px] tracking-[0.15em] uppercase font-medium hover:text-foreground hover:border-primary/40 transition-colors"
          >
            Explore Our Full Fleet
          </Link>
          <Link
            to="/request-flight"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground text-[12px] tracking-[0.15em] uppercase font-semibold hover:bg-primary/90 transition-colors shadow-[0_8px_24px_hsl(var(--primary)/0.25)]"
          >
            <Plane size={16} strokeWidth={1.5} />
            Request a Charter
          </Link>
        </div>
      </div>
    </section>

    {/* ═══ FINAL CTA ═══ */}
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-6 md:px-10 max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[11px] tracking-[0.4em] uppercase text-primary mb-4 font-medium">
            Ready to Fly?
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-5">
            Your GCC Charter Awaits
          </h2>
          <p className="text-muted-foreground text-[15px] leading-relaxed mb-10 max-w-xl mx-auto">
            Contact our team today to arrange your private jet charter across the Gulf. We're
            available 24/7 to handle every detail — from aircraft selection to ground transport.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/request-flight"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground text-[12px] tracking-[0.15em] uppercase font-semibold hover:bg-primary/90 transition-colors shadow-[0_8px_24px_hsl(var(--primary)/0.25)]"
            >
              <Plane size={16} strokeWidth={1.5} />
              Request a Flight
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-border text-foreground/70 text-[12px] tracking-[0.15em] uppercase font-medium hover:text-foreground hover:border-primary/40 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>
      </div>
    </section>

    <Footer />
  </div>
);

export default GccPage;
