import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CookiesPage = () => (
  <div className="min-h-screen bg-background text-foreground">
    <Navbar />
    <section className="pt-36 pb-24">
      <div className="container mx-auto px-8 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-display font-semibold mb-4 text-center">
          Cookies <span className="text-gradient-gold italic">Policy</span>
        </h1>
        <p className="text-[11px] text-foreground/30 font-extralight text-center mb-16">Last updated: March 2026</p>

        <div className="space-y-10 text-[13px] text-foreground/50 font-extralight leading-[2]">
          <div>
            <h2 className="text-[10px] tracking-[0.3em] uppercase text-primary/50 font-light mb-4">1. What Are Cookies</h2>
            <p>Cookies are small text files stored on your device when you visit our website. They help us provide a better experience by remembering your preferences, understanding how you use our site, and enabling certain features.</p>
          </div>
          <div>
            <h2 className="text-[10px] tracking-[0.3em] uppercase text-primary/50 font-light mb-4">2. Essential Cookies</h2>
            <p>These cookies are necessary for the website to function and cannot be disabled. They include session cookies for authentication, security cookies to protect against fraud, and load-balancing cookies that ensure reliable performance.</p>
          </div>
          <div>
            <h2 className="text-[10px] tracking-[0.3em] uppercase text-primary/50 font-light mb-4">3. Analytics Cookies</h2>
            <p>With your consent, we use analytics cookies to understand how visitors interact with our website. This helps us improve our services and user experience. These cookies collect aggregated, anonymous information about page visits and navigation patterns.</p>
          </div>
          <div>
            <h2 className="text-[10px] tracking-[0.3em] uppercase text-primary/50 font-light mb-4">4. Functional Cookies</h2>
            <p>Functional cookies remember your preferences such as language, region, and display settings. They enhance your experience but are not strictly necessary for the site to work.</p>
          </div>
          <div>
            <h2 className="text-[10px] tracking-[0.3em] uppercase text-primary/50 font-light mb-4">5. Managing Cookies</h2>
            <p>You can manage your cookie preferences through the cookie consent banner displayed on your first visit. You can also control cookies through your browser settings. Note that disabling certain cookies may affect your experience on our website.</p>
          </div>
          <div>
            <h2 className="text-[10px] tracking-[0.3em] uppercase text-primary/50 font-light mb-4">6. Third-Party Cookies</h2>
            <p>Some cookies are placed by third-party services that appear on our pages, such as embedded maps or chat services. We do not control these cookies. Please refer to the respective third-party privacy policies for more information.</p>
          </div>
          <div>
            <h2 className="text-[10px] tracking-[0.3em] uppercase text-primary/50 font-light mb-4">7. Contact</h2>
            <p>For questions about our use of cookies, contact us at privacy@universaljets.com.</p>
          </div>
        </div>
      </div>
    </section>
    <Footer />
  </div>
);

export default CookiesPage;
