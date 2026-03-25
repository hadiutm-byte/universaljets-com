import { motion } from "framer-motion";
import { FileText, Download } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const templates = [
  {
    title: "Quote Request Form",
    description: "Submit your flight requirements for a detailed quote.",
    file: "/templates/quote-form.docx",
  },
  {
    title: "Charter Contract",
    description: "Standard charter flight agreement template.",
    file: "/templates/charter-contract.docx",
  },
  {
    title: "Invoice",
    description: "Flight services invoice template.",
    file: "/templates/invoice.docx",
  },
  {
    title: "Payment Receipt",
    description: "Confirmation of payment received.",
    file: "/templates/receipt.docx",
  },
  {
    title: "Membership Enrollment Terms",
    description: "Private Access Network terms and conditions.",
    file: "/templates/membership-terms.docx",
  },
];

const ResourcesPage = () => (
  <div className="min-h-screen bg-background text-foreground">
    <Navbar />

    <section className="pt-36 pb-24">
      <div className="container mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">
            Downloads
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold mb-4">
            Resources & <span className="text-gradient-gold italic">Templates</span>
          </h1>
          <p className="text-[13px] text-foreground/35 font-extralight max-w-md mx-auto">
            Downloadable documents for charter operations, membership, and billing.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-4">
          {templates.map((t, i) => (
            <motion.a
              key={t.title}
              href={t.file}
              download
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group flex items-center gap-5 p-5 rounded-xl border border-border/10 bg-card/5 hover:border-primary/20 hover:bg-card/10 transition-all duration-500"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors duration-500">
                <FileText className="w-4 h-4 text-primary/40 group-hover:text-primary/70 transition-colors duration-500" strokeWidth={1.2} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[13px] font-medium text-foreground/70 group-hover:text-foreground/90 transition-colors duration-500">
                  {t.title}
                </h3>
                <p className="text-[11px] text-foreground/30 font-extralight mt-0.5">
                  {t.description}
                </p>
              </div>
              <Download className="w-4 h-4 text-foreground/15 group-hover:text-primary/50 transition-colors duration-500 flex-shrink-0" strokeWidth={1.2} />
            </motion.a>
          ))}
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default ResourcesPage;
