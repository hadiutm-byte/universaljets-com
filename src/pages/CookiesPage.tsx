import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const sections = [
  {
    title: "1. What Are Cookies",
    content: "Cookies are small text files stored on your device when you visit our website. They help us provide a better experience by remembering your preferences, understanding how you use our site, and enabling certain features essential to our service.",
  },
  {
    title: "2. Essential Cookies",
    content: "These cookies are necessary for the website to function and cannot be disabled. They include session cookies for authentication, security cookies to protect against fraud, and load-balancing cookies that ensure reliable performance. Without these cookies, our services cannot be provided.",
  },
  {
    title: "3. Analytics Cookies",
    content: "With your consent, we use analytics cookies to understand how visitors interact with our website. This helps us improve our services and user experience. These cookies collect aggregated, anonymous information about page visits, navigation patterns, and usage trends.",
  },
  {
    title: "4. Functional Cookies",
    content: "Functional cookies remember your preferences such as language, region, display settings, and previously entered route information. They enhance your experience but are not strictly necessary for the site to work.",
  },
  {
    title: "5. Managing Cookies",
    content: "You can manage your cookie preferences through the cookie consent banner displayed on your first visit. You can also control cookies through your browser settings. Note that disabling certain cookies may affect your experience on our website and limit available functionality.",
  },
  {
    title: "6. Third-Party Cookies",
    content: "Some cookies are placed by third-party services that appear on our pages, such as embedded maps, analytics platforms, or communication tools. We do not control these cookies. Please refer to the respective third-party privacy policies for more information.",
  },
  {
    title: "7. Contact",
    content: "For questions about our use of cookies, contact us at privacy@universaljets.com.",
  },
];

const CookiesPage = () => (
  <div className="min-h-screen bg-background text-foreground">
    <SEOHead title="Cookies Policy — Universal Jets" description="Learn about how Universal Jets uses cookies to enhance your browsing experience on our private aviation platform." path="/cookies" breadcrumbs={[{ name: "Home", path: "/" }, { name: "Cookies Policy", path: "/cookies" }]} />
    <Navbar />
    <section className="pt-36 pb-24">
      <div className="container mx-auto px-8 max-w-3xl">
        <p className="text-[10px] tracking-[0.5em] uppercase text-primary/60 mb-5 font-medium text-center">Legal</p>
        <h1 className="text-3xl md:text-4xl font-display font-semibold mb-4 text-center">
          Cookies <span className="text-gradient-gold italic">Policy</span>
        </h1>
        <p className="text-[11px] text-foreground/30 font-extralight text-center mb-6">Last updated: March 2026</p>
        <p className="text-[13px] text-muted-foreground font-light text-center mb-16 max-w-lg mx-auto leading-[1.9]">
          This policy explains how we use cookies and similar technologies on our website.
        </p>

        <div className="space-y-10 text-[13px] text-foreground/55 font-light leading-[2]">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="text-[10px] tracking-[0.3em] uppercase text-primary/50 font-medium mb-4">{s.title}</h2>
              <p>{s.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-10 border-t border-foreground/[0.04] text-center">
          <p className="text-[12px] text-muted-foreground/50 font-light mb-4">Related Documents</p>
          <div className="flex items-center justify-center gap-6 text-[11px]">
            <Link to="/terms" className="text-primary/70 hover:text-primary transition-colors tracking-wide uppercase font-medium">Terms & Conditions</Link>
            <span className="text-foreground/10">|</span>
            <Link to="/privacy" className="text-primary/70 hover:text-primary transition-colors tracking-wide uppercase font-medium">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </section>
    <Footer />
  </div>
);

export default CookiesPage;
