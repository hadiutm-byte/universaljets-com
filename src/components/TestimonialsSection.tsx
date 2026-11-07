import { useState, useEffect } from "react";
import { Star, Quote } from "lucide-react";
import { verifiedTestimonials } from "@/lib/claims";

// Quotes are shown only with the client's written consent on file (src/lib/claims.ts).
const testimonials = verifiedTestimonials();

const TestimonialsSection = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (testimonials.length < 2) return;
    const timer = setInterval(() => {
      setActive((p) => (p + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  if (testimonials.length === 0) return null;
  const t = testimonials[active];

  return (
    <section className="py-20 md:py-28 px-4" aria-label="Client testimonials">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-primary font-semibold tracking-[0.25em] uppercase text-[11px] mb-3">
          What Our Clients Say
        </p>
        <h2 className="font-display text-2xl md:text-4xl font-bold mb-14">
          Trusted by Leaders Worldwide
        </h2>

        <div className="relative min-h-[260px] flex items-center justify-center">
          <div
            key={active}
            className="animate-fade-in max-w-2xl mx-auto"
          >
            <Quote className="w-10 h-10 text-primary/30 mx-auto mb-6 rotate-180" />

            <blockquote className="text-base md:text-lg leading-relaxed font-light mb-8 italic text-foreground/80">
              "{t.text}"
            </blockquote>

            <div className="flex items-center justify-center gap-1 mb-4">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-primary text-primary"
                />
              ))}
            </div>

            <p className="font-semibold text-sm">{t.name}</p>
            <p className="text-muted-foreground text-xs mt-1">{t.title}</p>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`View testimonial ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === active
                  ? "bg-primary w-6"
                  : "bg-foreground/20 hover:bg-foreground/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
