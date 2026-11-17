export const site = {
  name: "Tangara",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://tangara.studio",
  email: "hello@tangara.studio",
  location: "Independent studio · Working worldwide",
  title: "Tangara — Creative & digital studio for ambitious businesses",
  description:
    "Tangara is a multidisciplinary creative and digital studio. Brand identity, websites, 3D & visual content, and marketing — for businesses of every kind.",
};

export const nav = [
  { href: "#about", label: "Studio" },
  { href: "#services", label: "Services" },
  { href: "#lab", label: "Lab" },
  { href: "#work", label: "Work" },
  { href: "#approach", label: "Approach" },
  { href: "#industries", label: "Industries" },
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

export const services = [
  {
    n: "01",
    t: "Brand & business identity",
    d: "Brand positioning, logo and visual identity, brand guidelines, presentations and promotional materials.",
    tags: ["Positioning", "Logo & identity", "Guidelines", "Presentations"],
  },
  {
    n: "02",
    t: "Web development & digital solutions",
    d: "Business websites, e-commerce, landing pages, booking systems, redesigns and optimization.",
    tags: ["Websites", "E-commerce", "Landing pages", "Booking systems"],
  },
  {
    n: "03",
    t: "Creative production & visual content",
    d: "Commercial photography, product and property renders, 3D visualization and promotional pieces.",
    tags: ["Photography", "3D renders", "Visualization", "Promo pieces"],
  },
  {
    n: "04",
    t: "Marketing & communication",
    d: "Social media content, advertising campaigns, marketing materials and promotional strategy.",
    tags: ["Social content", "Campaigns", "Collateral", "Brand voice"],
  },
  {
    n: "05",
    t: "Custom business solutions",
    d: "Tailor-made creative projects, process improvements, commercial materials and customer-experience upgrades.",
    tags: ["Bespoke projects", "Process", "Customer experience"],
  },
  {
    n: "06",
    t: "Flexible services",
    d: "Every service can be hired on its own or combined into one integrated project.",
    tags: ["À la carte", "Bundles", "Scalable"],
  },
];

export const processSteps = [
  { n: "01", k: "Diagnose", t: "Diagnosis & assessment", d: "We get to know your business, sector, goals, audience and current challenges." },
  { n: "02", k: "Propose", t: "Strategy & proposal", d: "We recommend solutions and define scope, deliverables, timeline and price." },
  { n: "03", k: "Build", t: "Planning & development", d: "We organize the project in stages and start design, development or production." },
  { n: "04", k: "Refine", t: "Review & adjustments", d: "We present progress, gather feedback and refine within the agreed scope." },
  { n: "05", k: "Deliver", t: "Delivery & support", d: "We hand over the finished project, files and access — and stay close when you need us." },
];

export const industries = [
  { t: "Restaurants", d: "Brand, menu design, website, reservation system and promotional content." },
  { t: "Real estate", d: "Websites, property renders, property presentations and marketing." },
  { t: "Construction", d: "Website, project portfolio, 3D visualization and corporate materials." },
  { t: "Retail", d: "Brand, online store, product photography and advertising." },
  { t: "Professional services", d: "Corporate identity, website, presentations and client-acquisition materials." },
  { t: "Startups", d: "Brand development, website, launch materials and marketing." },
];

export const model = [
  { n: "A", t: "Individual projects", d: "Services with a clearly defined scope, deliverables and price." },
  { n: "B", t: "Service packages", d: "Several complementary services brought together in a single solution." },
  { n: "C", t: "Monthly partnerships", d: "Recurring creative, digital and marketing support for businesses that need it continuously." },
];

export type MockKind = "sanos" | "terra" | "casa" | "common" | "mesa" | "iron" | "launch";

export type ShowcaseItem = {
  n: string;
  name: string;
  sector: string;
  url: string;
  kind: MockKind;
  tags: string[];
  blurb: string;
  /** Shipped, publicly reachable project (the rest are concept builds). */
  live?: { href: string; lang: string };
};

export const showcase: ShowcaseItem[] = [
  {
    n: "01",
    name: "SAN.OS — Mi PC",
    sector: "Live · Personal storytelling",
    url: "mi-pc-speedlogic-pc.vercel.app",
    kind: "sanos",
    live: { href: "https://mi-pc-speedlogic-pc.vercel.app/#inicio", lang: "Español" },
    tags: ["Spanish-language", "Interactive exploded view", "Timeline", "Tech explainers"],
    blurb:
      "A live site written and designed in Spanish: the story of one PC, from a laptop won in a contest to a custom-built tower. It has a terminal-style interface, an interactive exploded view you can drag and rotate, a year-by-year timeline and plain-language explainers. We create natively in English and Spanish.",
  },
  {
    n: "02",
    name: "Terra Supply",
    sector: "Food & culture",
    url: "terrasupply.co",
    kind: "terra",
    tags: ["Brand world", "Storefront", "Checkout"],
    blurb: "A brand world and online store built around warmth, texture and a very clear product story.",
  },
  {
    n: "03",
    name: "Casa Forma",
    sector: "Real estate",
    url: "casaforma.com",
    kind: "casa",
    tags: ["Listings", "3D renders", "Virtual tour"],
    blurb: "Property presentation with immersive renders and listings that make a home feel lived-in before the visit.",
  },
  {
    n: "04",
    name: "Common Ground",
    sector: "Positioning + campaign",
    url: "commonground.org",
    kind: "common",
    tags: ["Positioning", "Campaign site", "Lead capture"],
    blurb: "A campaign-ready site turning a sharp positioning into action and qualified enquiries.",
  },
  {
    n: "05",
    name: "Mesa",
    sector: "Restaurant",
    url: "mesa.restaurant",
    kind: "mesa",
    tags: ["Menu", "Booking system", "Gallery"],
    blurb: "A restaurant site with a real-time reservation flow and a menu that sells the evening.",
  },
  {
    n: "06",
    name: "Ironline",
    sector: "Construction",
    url: "ironline.build",
    kind: "iron",
    tags: ["Project portfolio", "3D visualization", "Quote request"],
    blurb: "A project portfolio with 3D visualization that lets clients see the build before it exists.",
  },
  {
    n: "07",
    name: "Launchpad",
    sector: "Startup",
    url: "launchpad.app",
    kind: "launch",
    tags: ["Waitlist", "Product story", "Analytics"],
    blurb: "A launch page designed to explain a new product in seconds and convert curiosity into signups.",
  },
];
