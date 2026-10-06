/** Single source of truth for business details used across the site. */

export const site = {
  name: "Industrial Prime System",
  partner: "Vijay Enterprises",
  legalName: "Industrial Prime System & Vijay Enterprises",
  shortName: "IPS & Vijay Enterprises",
  tagline: "Industrial Hardware & Machine Tool Solutions You Can Trust",
  description:
    "Industrial Prime System and Vijay Enterprises supply industrial hardware, machine tools, safety materials, material handling products, adhesives and industrial consumables to manufacturing units across Kolhapur and Western Maharashtra.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  address: {
    line1: "MIDC, Shiroli, Near Parmar Petrol Pump",
    line2: "Shiye Bawda Road",
    city: "Kolhapur",
    state: "Maharashtra",
    postalCode: "416122",
    country: "India",
  },
  /** Full single-line address, used in the footer and structured data. */
  get addressLine() {
    const a = this.address;
    return `${a.line1}, ${a.line2}, ${a.city}, ${a.state}, ${a.country}`;
  },
  mapQuery: "MIDC Shiroli, Shiye Bawda Road, Kolhapur, Maharashtra",
  contacts: [
    { name: "Anmol Patil", phone: "9146436464", role: "Sales & Enquiries", whatsapp: true },
    { name: "Vijay Patil", phone: "9422421458", role: "Partner", whatsapp: false },
  ],
  /** Every product / general enquiry on WhatsApp goes to Anmol Patil. */
  whatsapp: {
    number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919146436464",
    contactName: "Anmol Patil",
    displayNumber: "+91 91464 36464",
  },
  hours: [
    { days: "Monday – Saturday", time: "9:30 AM – 7:30 PM" },
    { days: "Sunday", time: "Closed" },
  ],
  serviceAreas: [
    "Kolhapur",
    "Shiroli MIDC",
    "Gokul Shirgaon MIDC",
    "Kagal Five Star MIDC",
    "Ichalkaranji",
    "Sangli",
    "Satara",
  ],
} as const;

export const enquiryStatuses = [
  "New",
  "Contacted",
  "Quoted",
  "Converted",
  "Closed",
] as const;

export type EnquiryStatus = (typeof enquiryStatuses)[number];
