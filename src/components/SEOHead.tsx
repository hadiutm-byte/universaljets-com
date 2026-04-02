import { useEffect } from "react";
import { trackPageView } from "@/lib/gtmEvents";
import { breadcrumbSchema } from "./JsonLd";

interface SEOHeadProps {
  title: string;
  description: string;
  path: string;
  type?: string;
  image?: string;
  /** Breadcrumb trail — auto-generates BreadcrumbList JSON-LD */
  breadcrumbs?: { name: string; path: string }[];
}

const SITE = "https://universaljets.com";
const DEFAULT_IMAGE = "https://universaljets.com/og-image.jpg";

const SEOHead = ({ title, description, path, type = "website", image, breadcrumbs }: SEOHeadProps) => {
  const fullTitle = `${title} | Universal Jets`;
  const url = `${SITE}${path}`;
  const img = image || DEFAULT_IMAGE;

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("name", "description", description);
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);
    setMeta("property", "og:type", type);
    setMeta("property", "og:image", img);
    setMeta("property", "og:site_name", "Universal Jets");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", img);
    setMeta("name", "twitter:card", "summary_large_image");

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url);

    // Breadcrumb JSON-LD
    const bcId = "seo-breadcrumb-jsonld";
    let bcScript = document.getElementById(bcId) as HTMLScriptElement | null;
    if (breadcrumbs && breadcrumbs.length > 0) {
      const items = breadcrumbs.map((b) => ({ name: b.name, url: `${SITE}${b.path}` }));
      const data = breadcrumbSchema(items);
      if (!bcScript) {
        bcScript = document.createElement("script");
        bcScript.id = bcId;
        bcScript.type = "application/ld+json";
        document.head.appendChild(bcScript);
      }
      bcScript.textContent = JSON.stringify(data);
    } else if (bcScript) {
      bcScript.remove();
    }

    trackPageView(path, fullTitle);

    return () => {
      // cleanup handled by next mount
    };
  }, [fullTitle, description, url, img, type, path, breadcrumbs]);

  return null;
};

export default SEOHead;
