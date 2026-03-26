import { useCallback } from "react";
import { generateEmptyLegShareCard } from "@/lib/emptyLegShareCard";
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
}

/**
 * Platform-wide share hook.
 * Generates a branded share card, attempts native Web Share API,
 * then falls back to download + clipboard copy.
 */
export function useShareCard() {
  const buildShareText = (data: ShareData) =>
    `✈️ Empty Leg Deal — ${data.aircraftType}\n${data.fromCity || data.fromCode} → ${data.toCity || data.toCode}\n📅 ${data.date}\n💰 ${data.price}\n\nBook now at Universal Jets\nhttps://www.universaljets.com`;

  const buildFileName = (data: ShareData) =>
    `universal-jets-empty-leg-${data.fromCode}-${data.toCode}.png`;

  const share = useCallback(async (data: ShareData) => {
    const shareText = buildShareText(data);
    const fileName = buildFileName(data);

    try {
      const blob = await generateEmptyLegShareCard(data);
      const file = new File([blob], fileName, { type: "image/png" });

      // Try native share with file
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: `Empty Leg: ${data.fromCity || data.fromCode} → ${data.toCity || data.toCode}`,
          text: shareText,
          files: [file],
        });
        return;
      }

      // Try native share without file
      if (navigator.share) {
        await navigator.share({
          title: `Empty Leg: ${data.fromCity || data.fromCode} → ${data.toCity || data.toCode}`,
          text: shareText,
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
      // Last resort: clipboard only
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
    const text = `✈️ Empty Leg: ${data.fromCity || data.fromCode} → ${data.toCity || data.toCode} | ${data.date} | ${data.price} — universaljets.com`;
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  }, []);

  return { share, download, copyText };
}
