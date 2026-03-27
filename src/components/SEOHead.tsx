import { useEffect } from "react";
import { trackPageView } from "@/lib/gtmEvents";

interface SEOHeadProps {
  title: string;
  description: string;
  path: string;
  type?: string;
  image?: string;
}

const SITE = "https://universaljets.com";
const DEFAULT_IMAGE = "https://www.universaljets.com/og-image.jpg";

const SEOHead = ({ title, description, path, type = "website", image }: SEOHeadProps) => {
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

    trackPageView(path, fullTitle);

    return () => {
      // cleanup handled by next mount
    };
  }, [fullTitle, description, url, img, type, path]);

  return null;
};

export default SEOHead;
