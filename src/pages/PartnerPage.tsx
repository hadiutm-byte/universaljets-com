import { motion } from "framer-motion";
import { Handshake, Hotel, Car, Gem } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const benefits = [
  { icon: Hotel, title: "Luxury Hotels", desc: "Connect your property with our global UHNW clientele" },
  { icon: Car, title: "Premium Ground Transport", desc: "Offer chauffeur and rental services to private jet travelers" },
  { icon: Gem, title: "Luxury Brands", desc: "Position your brand within an ultra-premium aviation ecosystem" },
];

const PartnerPage = () => (
  <div className="min-h-screen bg-background relative">
    <div className="fixed inset-0 opacity-[0.012] pointer-events-none z-[1]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat" }} />

    <div className="relative z-[2]">
      <Navbar />

      {/* Hero */}
      <section className="pt-40 pb-24 relative">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: "radial-gradient(ellipse 50% 40% at 50% 30%, hsla(38,52%,50%,0.3) 0%, transparent 70%)",
        }} />
        <div className="container mx-auto px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-16 h-16 rounded-full luxury-border flex items-center justify-center mx-auto mb-8 glow-subtle">
              <Handshake className="w-6 h-6 text-primary/60" strokeWidth={1.2} />
            </div>
            <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">
              Strategic Partnerships
            </p>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold text-foreground mb-6 leading-tight">
              Partner With{" "}
              <span className="text-gradient-gold italic">Universal Jets</span>
            </h1>
            <p className="text-[13px] md:text-[15px] text-foreground/40 font-extralight leading-[2] max-w-xl mx-auto">
              Join an exclusive network that connects your luxury brand, hotel, or service directly with our elite clientele.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="pb-24">
        <div className="container mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto text-center mb-16"
          >
            <p className="text-[12px] text-foreground/35 font-extralight leading-[2.2]">
              We partner with multinational hotels, luxury car rental companies, and premium travel brands worldwide.
              Offer our UHNW members exclusive concessions — upgrades, discounts, and premium experiences — while
              gaining access to one of the most exclusive private aviation networks.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-20">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="text-center py-10 px-6 rounded-xl border border-border/8 bg-card/8 hover:border-primary/15 hover:bg-card/15 transition-all duration-500 group"
              >
                <div className="w-14 h-14 rounded-full luxury-border flex items-center justify-center mx-auto mb-5 group-hover:glow-subtle transition-all duration-700">
                  <b.icon className="w-5 h-5 text-primary/60" strokeWidth={1.2} />
                </div>
                <h3 className="font-display text-[14px] text-foreground mb-2">{b.title}</h3>
                <p className="text-[11px] text-foreground/30 font-extralight leading-[1.8]">{b.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <p className="text-[11px] text-foreground/25 font-extralight mb-8 italic">
              Let's build value together.
            </p>
            <a
              href="mailto:partnerships@universaljets.com?subject=Partnership%20Inquiry"
              className="inline-block px-12 py-4 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.3em] uppercase font-medium rounded-sm transition-all duration-500 hover:shadow-[0_0_40px_-8px_hsla(38,52%,50%,0.5)] hover:scale-[1.02]"
            >
              Become a Partner
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  </div>
);

export default PartnerPage;
