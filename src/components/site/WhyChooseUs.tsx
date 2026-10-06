import {
  Boxes,
  BadgeCheck,
  Headset,
  MapPin,
  MessageSquareText,
  Timer,
  Truck,
  Wrench,
} from "lucide-react";

import { SectionHeading } from "@/components/site/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

const REASONS = [
  {
    icon: Boxes,
    title: "Wide Range Under One Roof",
    body: "Hardware, machine tools, safety, material handling, adhesives and consumables — one supplier instead of six, which means fewer purchase orders and fewer follow-ups.",
  },
  {
    icon: BadgeCheck,
    title: "Trusted Industrial Brands",
    body: "We stock and supply ANABOND, BOSS, McCoy and Golden Bullet alongside proven general-line products, so you get performance you can plan around.",
  },
  {
    icon: Wrench,
    title: "Genuine Products Only",
    body: "Every item is sourced through authorised channels. You receive the grade, specification and packing that the manufacturer intended — no substitutions.",
  },
  {
    icon: Headset,
    title: "Technical Product Support",
    body: "Not sure which grade, size or adhesive suits the job? Tell us the application and we will recommend the right product rather than just quoting a part number.",
  },
  {
    icon: Timer,
    title: "Fast Response on Enquiries",
    body: "Enquiries reaching us on WhatsApp during business hours are answered the same day with price and availability — because a stopped machine cannot wait.",
  },
  {
    icon: MessageSquareText,
    title: "Simple WhatsApp Ordering",
    body: "No portal logins, no minimum order value. Send the product, quantity and delivery point on WhatsApp and we take it from there.",
  },
  {
    icon: Truck,
    title: "Built for B2B Supply",
    body: "Bulk quantities, repeat monthly schedules, GST invoicing and consolidated deliveries for maintenance and production stores.",
  },
  {
    icon: MapPin,
    title: "Local to Kolhapur Industry",
    body: "Based in MIDC Shiroli and serving Gokul Shirgaon, Kagal Five Star, Ichalkaranji, Sangli and Satara — close enough to deliver quickly when it matters.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-steel-50 py-16 lg:py-24">
      <div
        aria-hidden
        className="absolute inset-0 bg-blueprint-light bg-grid opacity-60"
      />

      <div className="container-x relative">
        <SectionHeading
          eyebrow="Why choose us"
          title="A supply partner that industrial buyers keep coming back to"
          intro="Procurement is judged on availability, correctness and response time. That is exactly what we are set up to deliver."
        />

        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map((reason) => {
            const Icon = reason.icon;
            return (
              <RevealItem key={reason.title} className="h-full">
                <div className="group relative flex h-full flex-col rounded-lg border border-steel-200 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                  <span className="grid h-11 w-11 place-items-center rounded-md bg-navy-800 text-safety-400 transition-colors duration-300 group-hover:bg-safety-500 group-hover:text-white">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <h3 className="mt-4 font-display text-[15.5px] font-bold leading-snug text-navy-900">
                    {reason.title}
                  </h3>
                  <p className="mt-2.5 text-[13.5px] leading-relaxed text-steel-600">
                    {reason.body}
                  </p>
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 rounded-b-lg bg-safety-500 transition-transform duration-300 group-hover:scale-x-100"
                  />
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
