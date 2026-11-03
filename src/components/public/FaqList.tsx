import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { FaqItem } from "@/lib/siteContent";

const FaqList = ({ items }: { items: FaqItem[] }) => (
  <Accordion type="single" collapsible className="w-full">
    {items.map((f, i) => (
      <AccordionItem key={f.q} value={`faq-${i}`}>
        <AccordionTrigger className="text-left text-[15px] font-display min-h-[44px]">{f.q}</AccordionTrigger>
        <AccordionContent className="text-[14px] text-muted-foreground font-light leading-[1.9]">{f.a}</AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
);

export default FaqList;
