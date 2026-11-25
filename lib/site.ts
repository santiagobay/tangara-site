export const site = {
  name: "Tangara",
  // Note: tangara.studio belongs to an unrelated company — never use it here.
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://tangara-site.vercel.app").replace(/\/$/, ""),
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "santimax18@gmail.com",
  location: "Serving businesses across Canada",
  tagline: "Technology that moves businesses forward",
  title: "Tangara — Brand, websites & 3D for Canadian businesses",
  description:
    "Tangara designs brand identities, websites, 3D visuals and marketing for businesses across Canada. Strategy, design and code from one team.",
};

/** Links are "/#section" so they also work from other pages (e.g. /team). */
export const nav = [
  { href: "/#services", label: "Services" },
  { href: "/#work", label: "Work" },
  { href: "/#lab", label: "Lab" },
  { href: "/#approach", label: "Process" },
  { href: "/team", label: "Team" },
];

export const objectives = [
  { k: "Establish", v: "Define your identity and communicate what makes you different." },
  { k: "Improve", v: "Find opportunities in your image, brand, communication and customer experience." },
  { k: "Connect", v: "Reach and engage the audiences that matter to your business." },
  { k: "Grow", v: "Practical creative tools that support your commercial goals." },
];

export const pillars = [
  { k: "Integrated", v: "Brand, web, content and marketing under one coordinated roof." },
  { k: "Flexible", v: "Hire a single service or combine them into one complete project." },
  { k: "Personal", v: "Direct, attentive collaboration from first call to final delivery." },
];

export type Service = {
  n: string;
  /** Short id used to preselect the service in the contact form. */
  id: string;
  t: string;
  outcome: string;
  items: string[];
  /** Internal reference only (not shown on the site): "from" price in CAD, before GST/HST. */
  price: string;
  unit?: string;
};

/**
 * Services, priced for the Canadian small-business market (Nov 2026 benchmarks), kept below
 * typical agency rates and at least 10% above the original pricing sheet.
 */
export const services: Service[] = [
  {
    n: "01",
    id: "brand",
    t: "Brand identity",
    outcome: "Look like the business you are, everywhere people meet you",
    items: ["Strategy & positioning", "Logo & visual identity", "Brand guidelines", "Social media kit", "Brand refresh", "Marketing collateral"],
    price: "CAD $590",
  },
  {
    n: "02",
    id: "web",
    t: "Websites",
    outcome: "A fast site that explains what you do and turns visits into enquiries",
    items: ["Design & development", "Landing pages", "SEO essentials", "Contact & booking forms", "Analytics setup", "Online stores"],
    price: "CAD $1,290",
  },
  {
    n: "03",
    id: "3d",
    t: "3D & motion",
    outcome: "Show the product, the space or the idea before it exists",
    items: ["Product renders", "Architectural renders", "3D web experiences", "Motion graphics", "Interactive exploded views", "Launch visuals"],
    price: "CAD $690",
    unit: "per render",
  },
  {
    n: "04",
    id: "growth",
    t: "Marketing & growth",
    outcome: "Content, campaigns and lead capture that keep enquiries coming in",
    items: ["Social media content", "Digital campaigns", "Lead capture & basic CRM", "Email & automation", "Analytics & reporting", "Ongoing support"],
    price: "CAD $1,290",
    unit: "per month",
  },
  {
    n: "05",
    id: "realestate",
    t: "Real estate & development",
    outcome: "Sell the project before the first wall goes up",
    items: ["Project website", "Architectural renders", "Investor materials", "Marketing strategy", "Lead capture", "Sales presentations"],
    price: "CAD $3,490",
  },
];

export const processSteps = [
  { n: "01", k: "Diagnose", t: "Diagnosis & assessment", d: "We get to know your business, sector, goals, audience and current challenges." },
  { n: "02", k: "Propose", t: "Strategy & proposal", d: "We recommend solutions and define scope, deliverables, timeline and price." },
  { n: "03", k: "Build", t: "Planning & development", d: "We organize the project in stages and start design, development or production." },
  { n: "04", k: "Refine", t: "Review & adjustments", d: "We present progress, gather feedback and refine within the agreed scope." },
  { n: "05", k: "Deliver", t: "Delivery & support", d: "We hand over the finished project, files and access — and stay close when you need us." },
];

export const model = [
  { n: "A", t: "Individual projects", d: "Services with a clearly defined scope, deliverables and price." },
  { n: "B", t: "Service packages", d: "Several complementary services brought together in a single solution." },
  { n: "C", t: "Monthly partnerships", d: "Recurring creative, digital and marketing support for businesses that need it continuously." },
];

export type MockKind = "sanos" | "terra" | "casa" | "common" | "mesa" | "iron" | "launch";
