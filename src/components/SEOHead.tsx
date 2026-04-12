import { useEffect } from "react";
import { trackPageView } from "@/lib/gtmEvents";
import { breadcrumbSchema } from "./JsonLd";

interface SEOHeadProps {
  title: string;
  description: string;
  path: string;
  type?: string;
  image?: string;
  /** Set true to add noindex,nofollow — use for auth, dashboard, utility pages */
  noindex?: boolean;
  /** Breadcrumb trail — auto-generates BreadcrumbList JSON-LD */
  breadcrumbs?: { name: string; path: string }[];
  /** Optional article published date for article pages */
  publishedTime?: string;
  /** Optional article modified date */
  modifiedTime?: string;
}

const SITE = "https://universaljets.com";
const DEFAULT_IMAGE = "https://universaljets.com/og-image.jpg";
const BRAND = "Universal Jets";

const SEOHead = ({ title, description, path, type = "website", image, breadcrumbs, noindex, publishedTime, modifiedTime }: SEOHeadProps) => {
  const fullTitle = title.includes(BRAND) ? title : `${title} | ${BRAND}`;
  const url = `${SITE}${path}`;
  const img = image || DEFAULT_IMAGE;
  // Truncate description to 160 chars for optimal SEO
  const desc = description.length > 160 ? description.slice(0, 157) + "..." : description;

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

    // Core meta
    setMeta("name", "description", desc);

    // Open Graph
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:url", url);
    setMeta("property", "og:type", type);
    setMeta("property", "og:image", img);
    setMeta("property", "og:image:alt", `${title} — ${BRAND}`);
    setMeta("property", "og:site_name", BRAND);
    setMeta("property", "og:locale", "en_US");

    // Twitter Card
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", desc);
    setMeta("name", "twitter:image", img);
    setMeta("name", "twitter:image:alt", `${title} — ${BRAND}`);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:site", "@UniversalJets");

    // Article dates (for blog/editorial content)
    if (publishedTime) setMeta("property", "article:published_time", publishedTime);
    if (modifiedTime) setMeta("property", "article:modified_time", modifiedTime);

    // Robots
    if (noindex) {
      setMeta("name", "robots", "noindex, nofollow");
    } else {
      setMeta("name", "robots", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
    }

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
  }, [fullTitle, desc, url, img, type, path, breadcrumbs, noindex, publishedTime, modifiedTime]);

  return null;
};

export default SEOHead;