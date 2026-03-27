import { useCallback } from "react";
import { generateEmptyLegShareCard, SHARE_DEEP_LINK } from "@/lib/emptyLegShareCard";
import { toast } from "sonner";

export interface ShareData {
  fromCode: string;
  fromCity: string;
  toCode: string;
  toCity: string;
  date: string;
  price: string;
  aircraftType: string;
  category: string;
  aircraftImage?: string;
  maxPax?: number | null;
}

/**
 * Platform-wide share hook.
 * Generates a branded share card, attempts native Web Share API,
 * then falls back to download + clipboard copy.
 * Includes deep link to empty legs section.
 */
export function useShareCard() {
  const buildShareText = (data: ShareData) => {
    const from = data.fromCity || data.fromCode;
    const to = data.toCity || data.toCode;
    return `✈️ Empty Leg Deal — ${data.aircraftType}\n${from} → ${to}\n📅 ${data.date}\n💰 ${data.price}\n\nSave up to 75% vs on-demand charter\n\nBook now:\n${SHARE_DEEP_LINK}`;
  };

  const buildFileName = (data: ShareData) => {
    const from = (data.fromCity || data.fromCode).replace(/\s+/g, "-").toLowerCase();
    const to = (data.toCity || data.toCode).replace(/\s+/g, "-").toLowerCase();
    return `universal-jets-empty-leg-${from}-${to}.png`;
  };

  const share = useCallback(async (data: ShareData) => {
    const shareText = buildShareText(data);
    const fileName = buildFileName(data);
    const from = data.fromCity || data.fromCode;
    const to = data.toCity || data.toCode;

    try {
      const blob = await generateEmptyLegShareCard(data);
      const file = new File([blob], fileName, { type: "image/png" });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: `Empty Leg: ${from} → ${to}`,
          text: shareText,
          url: SHARE_DEEP_LINK,
          files: [file],
        });
        return;
      }

      if (navigator.share) {
        await navigator.share({
          title: `Empty Leg: ${from} → ${to}`,
          text: shareText,
          url: SHARE_DEEP_LINK,
        });
        return;
      }

      // Desktop fallback: download card + copy text
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
      await navigator.clipboard.writeText(shareText);
      toast.success("Share card downloaded & details copied");
    } catch {
      try {
        await navigator.clipboard.writeText(shareText);
        toast.success("Details copied to clipboard");
      } catch {
        toast.error("Unable to share");
      }
    }
  }, []);

  const download = useCallback(async (data: ShareData) => {
    try {
      const blob = await generateEmptyLegShareCard(data);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = buildFileName(data);
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Share card downloaded");
    } catch {
      toast.error("Failed to generate share card");
    }
  }, []);

  const copyText = useCallback(async (data: ShareData) => {
    const from = data.fromCity || data.fromCode;
    const to = data.toCity || data.toCode;
    const text = `✈️ Empty Leg: ${from} → ${to} | ${data.date} | ${data.price}\n\n${SHARE_DEEP_LINK}`;
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  }, []);

  return { share, download, copyText };
}
