import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const Crumbs = ({ items }: { items: { name: string; href?: string }[] }) => (
  <nav aria-label="Breadcrumb" className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground mb-6">
    <ol className="flex flex-wrap gap-2">
      {items.map((c, i) => (
        <li key={c.name} className="flex gap-2">
          {c.href ? <Link to={c.href} className="hover:text-primary">{c.name}</Link> : <span aria-current="page">{c.name}</span>}
          {i < items.length - 1 && <span aria-hidden="true">/</span>}
        </li>
      ))}
    </ol>
  </nav>
);

export const PageHero = ({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro?: string; children?: ReactNode }) => (
  <header className="pt-36 pb-12 md:pt-44 md:pb-16">
    <div className="container mx-auto px-5 md:px-8 max-w-4xl">
      {children}
      <p className="text-[10px] tracking-[0.4em] uppercase text-primary/70 mb-4">{eyebrow}</p>
      <h1 className="text-3xl md:text-5xl font-display font-semibold text-foreground leading-tight">{title}</h1>
      {intro && <p className="mt-6 text-[15px] text-muted-foreground font-light leading-[1.9] max-w-2xl">{intro}</p>}
    </div>
  </header>
);

export const CtaLink = ({ to, children }: { to: string; children: ReactNode }) => (
  <Link
    to={to}
    className="inline-flex items-center justify-center min-h-[48px] px-8 rounded-lg bg-gradient-gold text-primary-foreground text-[11px] tracking-[0.25em] uppercase font-medium"
  >
    {children}
  </Link>
);

const PublicPageShell = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen bg-background overflow-x-hidden">
    <Navbar />
    <main id="main-content">{children}</main>
    <Footer />
  </div>
);

export default PublicPageShell;
